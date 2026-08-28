# ============================================================
# LoanIQ Flask Backend
# ============================================================

from flask import Flask, request, jsonify, render_template
import os
import joblib
import pandas as pd


# ============================================================
# Path Setup
# ============================================================

BASE_DIR = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..")
)

TEMPLATE_DIR = os.path.join(
    BASE_DIR,
    "app",
    "templates"
)

STATIC_DIR = os.path.join(
    BASE_DIR,
    "app",
    "static"
)


# ============================================================
# Initialize Flask Application
# ============================================================

app = Flask(
    __name__,
    template_folder=TEMPLATE_DIR,
    static_folder=STATIC_DIR,
    static_url_path="/static"
)


# ============================================================
# ML Components
# ============================================================

model = None
preprocessor = None
scaler = None


def load_ml_components():
    """
    Load the trained LoanIQ model, preprocessor,
    and scaler from the models directory.
    """

    global model, preprocessor, scaler

    # Avoid loading the same files repeatedly
    if (
        model is not None
        and preprocessor is not None
        and scaler is not None
    ):
        return

    possible_model_dirs = [
        os.path.join(BASE_DIR, "models"),
        os.path.join(os.getcwd(), "models"),
        os.path.join(
            os.path.dirname(__file__),
            "..",
            "models"
        ),
        "models"
    ]

    for model_dir in possible_model_dirs:

        model_path = os.path.join(
            model_dir,
            "loan_approval_model.pkl"
        )

        preprocessor_path = os.path.join(
            model_dir,
            "loan_approval_preprocessor.pkl"
        )

        scaler_path = os.path.join(
            model_dir,
            "loan_approval_scaler.pkl"
        )

        if (
            os.path.exists(model_path)
            and os.path.exists(preprocessor_path)
            and os.path.exists(scaler_path)
        ):
            try:

                model = joblib.load(model_path)

                preprocessor = joblib.load(
                    preprocessor_path
                )

                scaler = joblib.load(
                    scaler_path
                )

                print(
                    f"Models successfully loaded from: "
                    f"{model_dir}"
                )

                return

            except Exception as e:

                print(
                    f"Error loading models from "
                    f"{model_dir}: {e}"
                )

    print(
        "Warning: ML model files could not "
        "be loaded immediately."
    )


# Load ML components when the application starts
load_ml_components()


# ============================================================
# FRONTEND
# ============================================================

@app.route("/", methods=["GET"])
def home():
    """
    Serve the LoanIQ frontend.

    The new frontend handles dashboard, assessment,
    samples, model, about, and results views on
    the client side.
    """

    return render_template("index.html")


@app.route("/app", methods=["GET"])
def frontend():
    """
    Alias route for the LoanIQ frontend.
    """

    return render_template("index.html")


# ============================================================
# HEALTH CHECK
# ============================================================

@app.route("/health", methods=["GET"])
@app.route("/api/health", methods=["GET"])
def health():
    """
    Check whether the LoanIQ ML pipeline is available.
    """

    load_ml_components()

    return jsonify({
        "status": "healthy",
        "model_loaded": model is not None,
        "preprocessor_loaded": preprocessor is not None,
        "scaler_loaded": scaler is not None
    })


# ============================================================
# PREDICTION API
# ============================================================

@app.route("/predict", methods=["POST"])
@app.route("/api/predict", methods=["POST"])
def predict():
    """
    Receive applicant information, preprocess it,
    run the trained model, and return the prediction.
    """

    try:

        # ----------------------------------------------------
        # Make sure ML components are available
        # ----------------------------------------------------

        load_ml_components()

        if (
            model is None
            or preprocessor is None
            or scaler is None
        ):

            return jsonify({
                "error": (
                    "Machine learning model artifacts "
                    "are not loaded properly."
                )
            }), 500


        # ----------------------------------------------------
        # Get JSON request data
        # ----------------------------------------------------

        data = request.get_json(
            silent=True
        )

        if not data:

            return jsonify({
                "error": "No input data provided."
            }), 400


        # ----------------------------------------------------
        # Create input DataFrame
        #
        # IMPORTANT:
        # These are the same 15 features expected
        # by the trained LoanIQ pipeline.
        # ----------------------------------------------------

        input_data = pd.DataFrame([{

            "Age": data["Age"],

            "AnnualIncome": data[
                "AnnualIncome"
            ],

            "CreditScore": data[
                "CreditScore"
            ],

            "EmploymentStatus": data[
                "EmploymentStatus"
            ],

            "EducationLevel": data[
                "EducationLevel"
            ],

            "LoanAmount": data[
                "LoanAmount"
            ],

            "LoanDuration": data[
                "LoanDuration"
            ],

            "MaritalStatus": data[
                "MaritalStatus"
            ],

            "NumberOfDependents": data[
                "NumberOfDependents"
            ],

            "HomeOwnershipStatus": data[
                "HomeOwnershipStatus"
            ],

            "MonthlyDebtPayments": data[
                "MonthlyDebtPayments"
            ],

            "DebtToIncomeRatio": data[
                "DebtToIncomeRatio"
            ],

            "BankruptcyHistory": data[
                "BankruptcyHistory"
            ],

            "PreviousLoanDefaults": data[
                "PreviousLoanDefaults"
            ],

            "PaymentHistory": data[
                "PaymentHistory"
            ]

        }])


        # ----------------------------------------------------
        # Preprocess input
        # ----------------------------------------------------

        processed_data = preprocessor.transform(
            input_data
        )


        # ----------------------------------------------------
        # Scale processed input
        # ----------------------------------------------------

        scaled_data = scaler.transform(
            processed_data
        )


        # ----------------------------------------------------
        # Generate prediction
        # ----------------------------------------------------

        prediction = model.predict(
            scaled_data
        )[0]


        # ----------------------------------------------------
        # Generate probability
        # ----------------------------------------------------

        probability = None

        if hasattr(
            model,
            "predict_proba"
        ):

            probability = model.predict_proba(
                scaled_data
            )[0][1]


        # ----------------------------------------------------
        # Convert prediction to readable result
        # ----------------------------------------------------

        if prediction == 1:

            result = "Approved"

        else:

            result = "Rejected"


        # ----------------------------------------------------
        # Build API response
        # ----------------------------------------------------

        response = {
            "prediction": int(prediction),
            "result": result
        }


        # Add probability when available
        if probability is not None:

            response[
                "approval_probability"
            ] = round(
                float(probability),
                4
            )


        return jsonify(response)


    # ========================================================
    # Missing field
    # ========================================================

    except KeyError as e:

        return jsonify({
            "error": (
                f"Missing required field: {str(e)}"
            )
        }), 400


    # ========================================================
    # Unexpected error
    # ========================================================

    except Exception as e:

        print(
            f"Prediction error: {e}"
        )

        return jsonify({
            "error": str(e)
        }), 500


# ============================================================
# APPLICATION ENTRY POINT
# ============================================================

if __name__ == "__main__":

    app.run(
        host="127.0.0.1",
        port=5000,
        debug=True
    )