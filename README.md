# LoanIQ

## AI-Powered Loan Approval Prediction System

LoanIQ is a machine learning-powered web application that predicts whether a loan application is likely to be **Approved** or **Rejected** based on an applicant's financial, demographic, employment, and credit-related information.

The project combines a **machine learning pipeline**, **Flask REST API**, and **web-based frontend** to create an end-to-end loan prediction system.

---

## 📌 Project Overview

Loan approval traditionally involves analyzing several factors such as:

- Applicant income
- Credit score
- Employment status
- Education level
- Loan amount
- Loan duration
- Debt-to-income ratio
- Previous loan defaults
- Bankruptcy history
- Payment history
- Home ownership
- Number of dependents

Manually evaluating all these factors can be time-consuming.

### LoanIQ's Goal

The goal of LoanIQ is to demonstrate how machine learning can assist in the initial assessment of loan applications.

The system:

1. Collects applicant information.
2. Preprocesses the input data.
3. Converts categorical data into numerical features.
4. Scales the processed features.
5. Sends the processed data to a trained machine learning model.
6. Predicts loan approval.
7. Calculates the model's approval probability.
8. Displays the result through a web interface.

> **Note:** LoanIQ is an educational/demo machine learning system. Its prediction should not be considered a real financial or lending decision.

---

# 🚀 Features

- AI-based loan approval prediction
- Machine learning preprocessing pipeline
- Categorical feature encoding
- Numerical feature processing
- Feature scaling
- Logistic Regression model
- Decision Tree model comparison
- Random Forest model comparison
- Approval probability
- Flask REST API
- Interactive web frontend
- Sample applicant datasets
- One-click sample form population
- Health-check API endpoint
- Model and preprocessing artifacts saved using Joblib
- Prediction result card
- Approval probability progress bar
- Try Another Application functionality

---

# 🧠 Machine Learning Workflow

The machine learning portion of LoanIQ was developed through several stages.

```text
Dataset
   ↓
Data Exploration
   ↓
Exploratory Data Analysis
   ↓
Correlation Analysis
   ↓
Feature Identification
   ↓
Data Preprocessing
   ↓
Train/Test Split
   ↓
Model Training
   ↓
Model Evaluation
   ↓
Model Comparison
   ↓
Final Model Selection
   ↓
Model Serialization
   ↓
Flask API Integration
   ↓
Frontend Integration
```

---

# 📊 Phase 1 — Dataset Exploration

The dataset was loaded and examined to understand:

- Number of records
- Number of features
- Data types
- Missing values
- Target variable
- Categorical variables
- Numerical variables

The target variable is:

```text
LoanApproved
```

Where:

```text
0 → Rejected
1 → Approved
```

---

# 📈 Phase 2 — Exploratory Data Analysis

The dataset was analyzed to understand the distribution of variables and relationships between different features.

Correlation analysis was performed to identify relationships between numerical features and the target variable.

Some notable correlations with `LoanApproved` included:

| Feature | Correlation |
|---|---:|
| MonthlyIncome | +0.604 |
| AnnualIncome | +0.598 |
| NetWorth | +0.188 |
| TotalAssets | +0.184 |
| CreditScore | +0.142 |
| RiskScore | -0.766 |
| TotalDebtToIncomeRatio | -0.410 |
| InterestRate | -0.302 |
| BaseInterestRate | -0.247 |
| LoanAmount | -0.239 |

This analysis helped identify variables that had stronger relationships with loan approval.

---

# 🔎 Phase 3 — Feature Identification

The dataset was divided into categorical and numerical features.

## Categorical Features

```text
EmploymentStatus
EducationLevel
MaritalStatus
HomeOwnershipStatus
```

## Numerical Features

```text
Age
AnnualIncome
CreditScore
LoanAmount
LoanDuration
NumberOfDependents
MonthlyDebtPayments
DebtToIncomeRatio
BankruptcyHistory
PreviousLoanDefaults
PaymentHistory
```

---

# ⚙️ Phase 4 — Data Preprocessing

Categorical variables were transformed into numerical representations using **One-Hot Encoding**.

The preprocessing pipeline generated **27 features** from the original input features.

The categorical features were encoded into columns such as:

```text
EmploymentStatus_Employed
EmploymentStatus_Self-Employed
EmploymentStatus_Unemployed

EducationLevel_Associate
EducationLevel_Bachelor
EducationLevel_Doctorate
EducationLevel_High School
EducationLevel_Master

MaritalStatus_Divorced
MaritalStatus_Married
MaritalStatus_Single
MaritalStatus_Widowed

HomeOwnershipStatus_Mortgage
HomeOwnershipStatus_Other
HomeOwnershipStatus_Own
HomeOwnershipStatus_Rent
```

The numerical features were retained and processed as part of the preprocessing pipeline.

---

# ✂️ Phase 5 — Train/Test Split

The dataset was divided into training and testing data.

```text
Training Data: 16,000 samples
Testing Data:   4,000 samples
```

After preprocessing:

```text
Training data: (16000, 27)
Testing data:  (4000, 27)
```

Therefore, the final machine learning models worked with **27 processed features**.

---

# 🤖 Phase 6 — Model Training

Three classification algorithms were evaluated.

## 1. Logistic Regression

Logistic Regression was used as the primary candidate model.

Results:

| Metric | Score |
|---|---:|
| Accuracy | 89.75% |
| Precision | 85.09% |
| Recall | 72.37% |
| F1 Score | 78.21% |

---

## 2. Decision Tree

Results:

| Metric | Score |
|---|---:|
| Accuracy | 83.38% |
| Precision | 67.12% |
| Recall | 67.85% |
| F1 Score | 67.48% |

---

## 3. Random Forest

Results:

| Metric | Score |
|---|---:|
| Accuracy | 88.58% |
| Precision | 84.40% |
| Recall | 67.55% |
| F1 Score | 75.04% |

---

# 🏆 Phase 7 — Model Selection

Based on the evaluation results, **Logistic Regression** was selected as the final model.

The final evaluation produced approximately:

```text
Accuracy  → 89.73%
Precision → 84.91%
Recall    → 72.47%
F1 Score  → 78.20%
```

Logistic Regression provided the strongest overall performance among the tested models, particularly in terms of accuracy, precision, recall, and F1 score.

---

# 💾 Phase 8 — Model Serialization

The trained machine learning components were saved using `joblib`.

The following files are used by the Flask backend:

```text
loan_approval_model.pkl
loan_approval_preprocessor.pkl
loan_approval_scaler.pkl
loan_approval_features.pkl
```

These files allow the Flask application to load the trained model and preprocessing components without retraining the model every time the application starts.

---

# 🌐 Phase 9 — Flask Backend

The backend was developed using **Flask**.

The Flask application provides three main endpoints.

---

## Home Endpoint

```text
GET /
```

Used to verify that the LoanIQ API is running.

Example response:

```json
{
    "message": "LoanIQ API is running.",
    "status": "success"
}
```

---

## Health Check Endpoint

```text
GET /health
```

This endpoint checks whether the required machine learning components have been successfully loaded.

It verifies:

- Model
- Preprocessor
- Scaler

Example:

```json
{
    "status": "healthy",
    "model_loaded": true,
    "preprocessor_loaded": true,
    "scaler_loaded": true
}
```

---

## Prediction Endpoint

```text
POST /predict
```

The frontend sends applicant information to this endpoint.

The backend processes the request through the machine learning pipeline:

```text
JSON Request
     ↓
Pandas DataFrame
     ↓
Preprocessor
     ↓
Scaler
     ↓
Machine Learning Model
     ↓
Prediction Probability
     ↓
JSON Response
```

Example response:

```json
{
    "prediction": 1,
    "result": "Approved",
    "approval_probability": 0.8973
}
```

Where:

```text
prediction = 1 → Approved
prediction = 0 → Rejected
```

---

# 🎨 Phase 10 — Frontend

The LoanIQ frontend was developed using:

- HTML5
- CSS3
- JavaScript
- Jinja templates

The frontend contains three major sections.

## Applicant Information

The user can enter:

- Age
- Annual Income
- Credit Score
- Employment Status
- Education Level

## Loan Information

The user can enter:

- Loan Amount
- Loan Duration
- Marital Status
- Number of Dependents
- Home Ownership Status

## Financial Information

The user can enter:

- Monthly Debt Payments
- Debt-to-Income Ratio
- Bankruptcy History
- Previous Loan Defaults
- Payment History

---

# 🧪 Phase 11 — Sample Applicants

LoanIQ includes **10 sample applicant buttons**.

These allow users to quickly test the application without manually entering every field.

The workflow is:

```text
Click Sample Applicant
        ↓
Form Automatically Populated
        ↓
Review Applicant Information
        ↓
Click Predict Loan Approval
        ↓
Data Sent to Flask API
        ↓
Machine Learning Prediction
        ↓
Result Displayed
```

The sample applicants contain different combinations of financial and demographic characteristics to demonstrate how the prediction system behaves with different inputs.

---

# 📊 Phase 12 — Prediction Result

After submitting an application, LoanIQ displays:

- Loan approval status
- Approval probability
- Probability progress bar
- Explanation message
- Try Another Application button

Example:

```text
Loan Approved

Approval Probability:
89.73%

██████████████████░░
```

For rejected applications, the interface displays the corresponding rejection result.

The probability shown is the model's estimated probability of the `Approved` class.

---

# 📁 Project Structure

```text
LoanIQ/
│
├── app/
│   │
│   ├── app.py
│   │
│   ├── templates/
│   │   └── index.html
│   │
│   └── static/
│       ├── style.css
│       └── script.js
│
├── models/
│   ├── loan_approval_model.pkl
│   ├── loan_approval_preprocessor.pkl
│   ├── loan_approval_scaler.pkl
│   └── loan_approval_features.pkl
│
├── notebooks/
│   └── LoanIQ.ipynb
│
├── data/
│   └── loan_dataset.csv
│
├── requirements.txt
│
├── README.md
│
└── .gitignore
```

---

# 📂 Directory and File Description

| File/Directory | Purpose |
|---|---|
| `app/` | Flask backend and frontend application |
| `app/app.py` | Main Flask application |
| `app/templates/` | HTML/Jinja templates |
| `app/templates/index.html` | LoanIQ frontend |
| `app/static/` | Frontend CSS and JavaScript |
| `app/static/style.css` | Frontend styling |
| `app/static/script.js` | Form submission and API communication |
| `models/` | Saved machine learning components |
| `notebooks/` | Machine learning development |
| `data/` | Dataset |
| `requirements.txt` | Python dependencies |
| `README.md` | Project documentation |
| `.gitignore` | Files excluded from Git |

---

# 🛠️ Technologies Used

## Programming Languages

- Python
- JavaScript
- HTML
- CSS

## Backend

- Flask

## Machine Learning

- Scikit-learn
- Logistic Regression
- Decision Tree
- Random Forest

## Data Processing

- Pandas
- NumPy
- One-Hot Encoding
- Feature Scaling

## Model Serialization

- Joblib

## Development Tools

- Jupyter Notebook
- Git
- GitHub
- VS Code / Jupyter

---

# ⚙️ Project Setup

Follow the steps below to run LoanIQ locally.

---

## 1. Clone the Repository

Clone the GitHub repository:

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
```

Move into the project directory:

```bash
cd LoanIQ
```

---

# 🐍 2. Create a Virtual Environment

Creating a virtual environment keeps the project's Python dependencies isolated from the rest of the system.

On Windows:

```powershell
python -m venv venv
```

Activate the virtual environment:

```powershell
venv\Scripts\activate
```

After successful activation, your terminal should look similar to:

```text
(venv) PS C:\Desktop\LoanIQ>
```

---

# 📦 3. Install Requirements

With the virtual environment activated, install the required packages:

```powershell
pip install -r requirements.txt
```

The required packages include:

```text
Flask
pandas
numpy
scikit-learn
joblib
```

---

# ▶️ 4. Run the Flask Backend

Make sure you are in the project root directory:

```text
LoanIQ/
```

Run:

```powershell
python app/app.py
```

The Flask server will start at:

```text
http://127.0.0.1:5000
```

You should see messages similar to:

```text
Model loaded successfully.
Preprocessor loaded successfully.
Scaler loaded successfully.
```

---

# 🌐 5. Open the LoanIQ Frontend

Once Flask is running, open the following URL in your browser:

```text
http://127.0.0.1:5000/app
```

This opens the complete LoanIQ frontend.

> Do not open `index.html` directly from File Explorer because the frontend uses Flask/Jinja functionality such as `url_for()`.

---

# 🔍 6. Test the Backend

You can verify that the backend is running by opening:

```text
http://127.0.0.1:5000/
```

Expected response:

```json
{
    "message": "LoanIQ API is running.",
    "status": "success"
}
```

You can also check the model status:

```text
http://127.0.0.1:5000/health
```

---

# 🛑 Stop the Backend

To stop the Flask development server:

```text
Ctrl + C
```

---

# 🔄 Running LoanIQ Again

Every time you want to run the project:

### Step 1 — Navigate to the project

```powershell
cd LoanIQ
```

### Step 2 — Activate virtual environment

```powershell
venv\Scripts\activate
```

### Step 3 — Run Flask

```powershell
python app/app.py
```

### Step 4 — Open the frontend

```text
http://127.0.0.1:5000/app
```

---

# 🧪 Running the Machine Learning Notebook

The machine learning development process is available inside:

```text
notebooks/
```

Launch Jupyter Notebook:

```powershell
jupyter notebook
```

or JupyterLab:

```powershell
jupyter lab
```

The notebook contains the machine learning workflow:

```text
Dataset Loading
      ↓
Data Exploration
      ↓
Exploratory Data Analysis
      ↓
Correlation Analysis
      ↓
Feature Identification
      ↓
Preprocessing
      ↓
Train/Test Split
      ↓
Model Training
      ↓
Model Evaluation
      ↓
Model Comparison
      ↓
Final Model Selection
      ↓
Model Serialization
```

---

# 📡 API Architecture

The overall application architecture is:

```text
                         LoanIQ
                           │
             ┌─────────────┴─────────────┐
             │                           │
             ▼                           ▼
       Web Frontend                 ML Components
       HTML/CSS/JS                  Saved .pkl Files
             │                           │
             │ POST /predict             │
             ▼                           │
       Flask Backend ◄───────────────────┘
             │
             ▼
       Input Validation
             │
             ▼
       Preprocessor
             │
             ▼
          Scaler
             │
             ▼
    Logistic Regression
             │
       ┌─────┴─────┐
       ▼           ▼
   Prediction   Probability
       │           │
       └─────┬─────┘
             ▼
       JSON Response
             │
             ▼
       Frontend Result
```

---

# 📋 Model Input Features

The `/predict` API expects the following fields:

```text
Age
AnnualIncome
CreditScore
EmploymentStatus
EducationLevel
LoanAmount
LoanDuration
MaritalStatus
NumberOfDependents
HomeOwnershipStatus
MonthlyDebtPayments
DebtToIncomeRatio
BankruptcyHistory
PreviousLoanDefaults
PaymentHistory
```

Example request:

```json
{
    "Age": 37,
    "AnnualIncome": 103264,
    "CreditScore": 594,
    "EmploymentStatus": "Employed",
    "EducationLevel": "Associate",
    "LoanAmount": 9184,
    "LoanDuration": 36,
    "MaritalStatus": "Married",
    "NumberOfDependents": 1,
    "HomeOwnershipStatus": "Mortgage",
    "MonthlyDebtPayments": 274,
    "DebtToIncomeRatio": 0.078884,
    "BankruptcyHistory": 0,
    "PreviousLoanDefaults": 0,
    "PaymentHistory": 26
}
```

Example response:

```json
{
    "prediction": 1,
    "result": "Approved",
    "approval_probability": 0.8973
}
```

---

# 🔄 End-to-End Prediction Flow

When a user clicks **Predict Loan Approval**, the following process occurs:

```text
User enters application details
             ↓
JavaScript collects form data
             ↓
POST request to /predict
             ↓
Flask receives JSON
             ↓
JSON converted to Pandas DataFrame
             ↓
Saved preprocessing pipeline
             ↓
Categorical encoding
             ↓
Feature scaling
             ↓
Saved Logistic Regression model
             ↓
Prediction generated
             ↓
Approval probability calculated
             ↓
Flask returns JSON
             ↓
JavaScript receives response
             ↓
Result card displayed
```

---

# 📈 Model Performance

The evaluated models produced the following results:

| Model | Accuracy | Precision | Recall | F1 Score |
|---|---:|---:|---:|---:|
| Logistic Regression | **89.75%** | **85.09%** | **72.37%** | **78.21%** |
| Decision Tree | 83.38% | 67.12% | 67.85% | 67.48% |
| Random Forest | 88.58% | 84.40% | 67.55% | 75.04% |

The final Logistic Regression model achieved approximately:

**89.73% accuracy on the final evaluation dataset.**

---

# 🎯 Project Motivation

LoanIQ was created to demonstrate the complete lifecycle of a machine learning application.

Instead of building only a machine learning notebook, the project connects:

```text
Data Science
     +
Machine Learning
     +
Data Preprocessing
     +
Model Evaluation
     +
Backend Development
     +
REST API
     +
Frontend Development
```

This makes LoanIQ an example of an **end-to-end machine learning application**.

The project demonstrates how a trained machine learning model can move from experimentation in a Jupyter Notebook into a functional application that users can interact with through a web interface.

---

# 💡 What This Project Demonstrates

Through LoanIQ, the following concepts are demonstrated:

### Machine Learning

- Classification
- Logistic Regression
- Decision Trees
- Random Forest
- Model comparison
- Model evaluation
- Accuracy
- Precision
- Recall
- F1 Score
- Prediction probability

### Data Science

- Dataset exploration
- Feature identification
- Categorical data handling
- Numerical data handling
- Correlation analysis
- Data preprocessing
- Train/test splitting
- Feature transformation

### Backend Development

- Flask
- REST APIs
- JSON requests
- JSON responses
- API routes
- Error handling
- Model loading
- Backend-to-model integration

### Frontend Development

- HTML forms
- CSS styling
- JavaScript
- Fetch API
- Dynamic result rendering
- Sample data buttons
- API integration

### Deployment Preparation

- Virtual environments
- Requirements management
- Project structure
- Git/GitHub workflow
- Model serialization

---

# 🔮 Future Improvements

Possible improvements for future versions include:

- User authentication
- Database integration
- Applicant history
- Loan application storage
- Admin dashboard
- Model explainability
- Feature importance visualization
- SHAP-based explanations
- Better probability calibration
- Hyperparameter tuning
- Cross-validation
- Additional machine learning models
- Model monitoring
- Docker containerization
- Cloud deployment
- PostgreSQL/MongoDB integration
- Automated model retraining
- Credit-risk scoring dashboard
- PDF loan assessment reports
- Applicant risk explanation
- Loan recommendation system

---

# ⚠️ Disclaimer

LoanIQ is an **educational and demonstration machine learning project**.

The predictions generated by this application are based on a trained machine learning model and should **not** be treated as professional financial advice or as an actual banking/lending decision.

Real-world loan approval systems involve additional factors such as:

- Financial verification
- Regulatory requirements
- Credit bureau information
- Fraud detection
- Human review
- Risk management policies
- Institutional lending rules

Therefore, LoanIQ should only be considered a demonstration of how machine learning can be integrated into a web application.

---

# 👨‍💻 Author

**Bikram Gorai**

Computer Science Engineering

---

# 📜 License

This project is intended for educational and demonstration purposes.

If you plan to distribute or modify this project publicly, add an appropriate open-source license.

---

# ⭐ Project Summary

LoanIQ demonstrates a complete machine learning application from **dataset to deployment-ready web application**.

```text
             LOANIQ

        Dataset & EDA
              ↓
      Feature Engineering
              ↓
        Preprocessing
              ↓
       Model Training
              ↓
       Model Evaluation
              ↓
      Model Selection
              ↓
       Model Serialization
              ↓
        Flask REST API
              ↓
      HTML/CSS/JavaScript
              ↓
       User Prediction
              ↓
      Approval Probability
```

The core objective of LoanIQ is to demonstrate how a machine learning model can be transformed into a usable software product by combining **machine learning, backend development, API development, and frontend development**.