# Flask Backend - LoanIQ

from flask import Flask, request, jsonify
import joblib

app = Flask(__name__)

# Load trained model
model = joblib.load("../models/loan_approval_model.pkl")
preprocessor = joblib.load("../models/loan_approval_preprocessor.pkl")
scaler = joblib.load("../models/loan_approval_scaler.pkl")


@app.route("/")
def home():
    return "LoanIQ API is running."


if __name__ == "__main__":
    app.run(debug=True)