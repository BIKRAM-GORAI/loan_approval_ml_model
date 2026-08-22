# LoanIQ Flask Backend

from flask import Flask, request, jsonify
import os
import joblib


# --------------------------------------------------
# Initialize Flask Application
# --------------------------------------------------

app = Flask(__name__)


# --------------------------------------------------
# Load Saved Machine Learning Components
# --------------------------------------------------

# Get the project root directory
# app.py is inside: loaniq/app/
# Therefore, going one level up gives: loaniq/
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


# Paths to saved model files
MODEL_PATH = os.path.join(
    BASE_DIR,
    "models",
    "loan_approval_model.pkl"
)

PREPROCESSOR_PATH = os.path.join(
    BASE_DIR,
    "models",
    "loan_approval_preprocessor.pkl"
)

SCALER_PATH = os.path.join(
    BASE_DIR,
    "models",
    "loan_approval_scaler.pkl"
)


# Load model
model = joblib.load(MODEL_PATH)

# Load preprocessing pipeline
preprocessor = joblib.load(PREPROCESSOR_PATH)

# Load scaler
scaler = joblib.load(SCALER_PATH)


print("Model loaded successfully.")
print("Preprocessor loaded successfully.")
print("Scaler loaded successfully.")


# --------------------------------------------------
# Home Route
# --------------------------------------------------

@app.route("/", methods=["GET"])
def home():

    return jsonify({
        "message": "LoanIQ API is running.",
        "status": "success"
    })


# --------------------------------------------------
# Health Check Route
# --------------------------------------------------

@app.route("/health", methods=["GET"])
def health():

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
def predict():

    try:

        # Get JSON data from request
        data = request.get_json()

        if not data:
            return jsonify({
                "error": "No input data provided."
            }), 400


        # --------------------------------------------------
        # Create input data
        # --------------------------------------------------

        import pandas as pd

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
        # Make prediction
        # --------------------------------------------------

        prediction = model.predict(processed_data)[0]


        # --------------------------------------------------
        # Get prediction probability
        # --------------------------------------------------

        probability = None

        if hasattr(model, "predict_proba"):

            probability = model.predict_proba(processed_data)[0][1]


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
            response["approval_probability"] = round(
                float(probability),
                4
            )


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
# Run Flask Application
# --------------------------------------------------

if __name__ == "__main__":

    app.run(
        host="127.0.0.1",
        port=5000,
        debug=True
    )