# LoanIQ Flask Backend

from flask import Flask, request, jsonify, render_template, send_from_directory
import os
import joblib
import pandas as pd

# --------------------------------------------------
# Path Setup
# --------------------------------------------------
# Get project root directory
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))

TEMPLATE_DIR = os.path.join(BASE_DIR, "app", "templates")
STATIC_DIR = os.path.join(BASE_DIR, "app", "static")

# --------------------------------------------------
# Initialize Flask Application
# --------------------------------------------------
app = Flask(
    __name__,
    template_folder=TEMPLATE_DIR,
    static_folder=STATIC_DIR,
    static_url_path="/static"
)

# --------------------------------------------------
# Load Saved Machine Learning Components
# --------------------------------------------------
model = None
preprocessor = None
scaler = None

def load_ml_components():
    global model, preprocessor, scaler
    if model is not None and preprocessor is not None and scaler is not None:
        return

    possible_model_dirs = [
        os.path.join(BASE_DIR, "models"),
        os.path.join(os.getcwd(), "models"),
        os.path.join(os.path.dirname(__file__), "..", "models"),
        "models"
    ]

    for model_dir in possible_model_dirs:
        model_path = os.path.join(model_dir, "loan_approval_model.pkl")
        preprocessor_path = os.path.join(model_dir, "loan_approval_preprocessor.pkl")
        scaler_path = os.path.join(model_dir, "loan_approval_scaler.pkl")

        if os.path.exists(model_path) and os.path.exists(preprocessor_path) and os.path.exists(scaler_path):
            try:
                model = joblib.load(model_path)
                preprocessor = joblib.load(preprocessor_path)
                scaler = joblib.load(scaler_path)
                print(f"Models successfully loaded from: {model_dir}")
                return
            except Exception as e:
                print(f"Error loading models from {model_dir}: {e}")

    print("Warning: ML model files could not be loaded immediately.")

# Load models on initialization
load_ml_components()


# --------------------------------------------------
# Frontend Routes
# --------------------------------------------------
@app.route("/", methods=["GET"])
def home():
    """Serve the main LoanIQ web application directly at the root URL."""
    return render_template("index.html")

@app.route("/app", methods=["GET"])
def frontend():
    """Alias route for frontend."""
    return render_template("index.html")


# --------------------------------------------------
# Health Check Route
# --------------------------------------------------
@app.route("/health", methods=["GET"])
@app.route("/api/health", methods=["GET"])
def health():
    load_ml_components()
    return jsonify({
        "status": "healthy",
        "model_loaded": model is not None,
        "preprocessor_loaded": preprocessor is not None,
        "scaler_loaded": scaler is not None
    })


# --------------------------------------------------
# Prediction Route
# --------------------------------------------------
@app.route("/predict", methods=["POST"])
@app.route("/api/predict", methods=["POST"])
def predict():
    try:
        load_ml_components()

        if model is None or preprocessor is None or scaler is None:
            return jsonify({
                "error": "Machine learning model artifacts are not loaded properly."
            }), 500

        # Get JSON data from request
        data = request.get_json(silent=True)

        if not data:
            return jsonify({
                "error": "No input data provided."
            }), 400

        # --------------------------------------------------
        # Create input DataFrame
        # --------------------------------------------------
        input_data = pd.DataFrame([{
            "Age": data["Age"],
            "AnnualIncome": data["AnnualIncome"],
            "CreditScore": data["CreditScore"],
            "EmploymentStatus": data["EmploymentStatus"],
            "EducationLevel": data["EducationLevel"],
            "LoanAmount": data["LoanAmount"],
            "LoanDuration": data["LoanDuration"],
            "MaritalStatus": data["MaritalStatus"],
            "NumberOfDependents": data["NumberOfDependents"],
            "HomeOwnershipStatus": data["HomeOwnershipStatus"],
            "MonthlyDebtPayments": data["MonthlyDebtPayments"],
            "DebtToIncomeRatio": data["DebtToIncomeRatio"],
            "BankruptcyHistory": data["BankruptcyHistory"],
            "PreviousLoanDefaults": data["PreviousLoanDefaults"],
            "PaymentHistory": data["PaymentHistory"]
        }])

        # --------------------------------------------------
        # Preprocess input
        # --------------------------------------------------
        processed_data = preprocessor.transform(input_data)

        # --------------------------------------------------
        # Scale processed input
        # --------------------------------------------------
        scaled_data = scaler.transform(processed_data)

        # --------------------------------------------------
        # Make prediction
        # --------------------------------------------------
        prediction = model.predict(scaled_data)[0]

        # --------------------------------------------------
        # Get prediction probability
        # --------------------------------------------------
        probability = None
        if hasattr(model, "predict_proba"):
            probability = model.predict_proba(scaled_data)[0][1]

        # --------------------------------------------------
        # Convert prediction to readable result
        # --------------------------------------------------
        if prediction == 1:
            result = "Approved"
        else:
            result = "Rejected"

        # --------------------------------------------------
        # Return response
        # --------------------------------------------------
        response = {
            "prediction": int(prediction),
            "result": result
        }

        if probability is not None:
            response["approval_probability"] = round(float(probability), 4)

        return jsonify(response)

    except KeyError as e:
        return jsonify({
            "error": f"Missing required field: {str(e)}"
        }), 400

    except Exception as e:
        return jsonify({
            "error": str(e)
        }), 500


# --------------------------------------------------
# Run Flask Application Locally
# --------------------------------------------------
if __name__ == "__main__":
    app.run(
        host="127.0.0.1",
        port=5000,
        debug=True
    )