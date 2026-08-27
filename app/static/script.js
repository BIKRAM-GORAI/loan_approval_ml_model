// LoanIQ Frontend Script

const form = document.getElementById("loanForm");
const resultBox = document.getElementById("result");
const submitBtn = form.querySelector('button[type="submit"]');

form.addEventListener("submit", async function (event) {
  event.preventDefault();

  // Collect and parse form data
  const formData = {
    Age: Number(document.getElementById("age").value),
    AnnualIncome: Number(document.getElementById("annualIncome").value),
    CreditScore: Number(document.getElementById("creditScore").value),
    EmploymentStatus: document.getElementById("employmentStatus").value,
    EducationLevel: document.getElementById("educationLevel").value,
    LoanAmount: Number(document.getElementById("loanAmount").value),
    LoanDuration: Number(document.getElementById("loanDuration").value),
    MaritalStatus: document.getElementById("maritalStatus").value,
    NumberOfDependents: Number(document.getElementById("dependents").value),
    HomeOwnershipStatus: document.getElementById("homeOwnership").value,
    MonthlyDebtPayments: Number(document.getElementById("monthlyDebt").value),
    DebtToIncomeRatio: Number(document.getElementById("dti").value),
    BankruptcyHistory: Number(document.getElementById("bankruptcy").value),
    PreviousLoanDefaults: Number(document.getElementById("previousDefaults").value),
    PaymentHistory: Number(document.getElementById("paymentHistory").value),
  };

  const originalBtnText = submitBtn.textContent;
  submitBtn.disabled = true;
  submitBtn.textContent = "Analyzing Application...";

  try {
    // Send applicant data to API
    const response = await fetch("/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Prediction failed. Please try again.");
    }

    resultBox.style.display = "block";

    const probabilityPct = result.approval_probability !== undefined 
      ? (result.approval_probability * 100).toFixed(1) 
      : null;

    if (result.prediction === 1) {
      resultBox.className = "result-card approved";
      resultBox.innerHTML = `
        <div class="result-icon">✓</div>
        <h2>Loan Approved</h2>
        ${probabilityPct ? `
          <p>Approval Probability: <strong>${probabilityPct}%</strong></p>
          <div class="probability-container">
            <div class="probability-bar">
              <div id="probabilityFill" style="width: ${probabilityPct}%"></div>
            </div>
          </div>
        ` : ''}
        <p>The applicant meets the model's approval criteria.</p>
        <button type="button" id="resetButton" onclick="resetForm()">
          Try Another Application
        </button>
      `;
    } else {
      resultBox.className = "result-card rejected";
      resultBox.innerHTML = `
        <div class="result-icon">✕</div>
        <h2>Loan Rejected</h2>
        ${probabilityPct ? `
          <p>Approval Probability: <strong>${probabilityPct}%</strong></p>
          <div class="probability-container">
            <div class="probability-bar">
              <div id="probabilityFill" style="width: ${probabilityPct}%"></div>
            </div>
          </div>
        ` : ''}
        <p>The applicant does not meet the model's approval criteria.</p>
        <button type="button" id="resetButton" onclick="resetForm()">
          Try Another Application
        </button>
      `;
    }

    resultBox.scrollIntoView({ behavior: "smooth", block: "center" });

  } catch (error) {
    console.error("Prediction Error:", error);
    resultBox.style.display = "block";
    resultBox.className = "result-card rejected";
    resultBox.innerHTML = `
      <div class="result-icon">!</div>
      <h2>Prediction Error</h2>
      <p>${error.message}</p>
      <button type="button" id="resetButton" onclick="resetForm()">Try Again</button>
    `;
    resultBox.scrollIntoView({ behavior: "smooth", block: "center" });
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = originalBtnText;
  }
});

// Sample Applicant Data
const sampleApplicants = [
  {
    Age: 35,
    AnnualIncome: 95000,
    CreditScore: 760,
    EmploymentStatus: "Employed",
    EducationLevel: "Master",
    LoanAmount: 18000,
    LoanDuration: 36,
    MaritalStatus: "Married",
    NumberOfDependents: 1,
    HomeOwnershipStatus: "Own",
    MonthlyDebtPayments: 350,
    DebtToIncomeRatio: 0.18,
    BankruptcyHistory: 0,
    PreviousLoanDefaults: 0,
    PaymentHistory: 29,
  },
  {
    Age: 42,
    AnnualIncome: 140000,
    CreditScore: 720,
    EmploymentStatus: "Employed",
    EducationLevel: "Bachelor",
    LoanAmount: 30000,
    LoanDuration: 48,
    MaritalStatus: "Married",
    NumberOfDependents: 2,
    HomeOwnershipStatus: "Mortgage",
    MonthlyDebtPayments: 700,
    DebtToIncomeRatio: 0.22,
    BankruptcyHistory: 0,
    PreviousLoanDefaults: 0,
    PaymentHistory: 27,
  },
  {
    Age: 39,
    AnnualIncome: 45000,
    CreditScore: 510,
    EmploymentStatus: "Employed",
    EducationLevel: "Bachelor",
    LoanAmount: 22000,
    LoanDuration: 60,
    MaritalStatus: "Single",
    NumberOfDependents: 2,
    HomeOwnershipStatus: "Rent",
    MonthlyDebtPayments: 850,
    DebtToIncomeRatio: 0.45,
    BankruptcyHistory: 0,
    PreviousLoanDefaults: 1,
    PaymentHistory: 18,
  },
  {
    Age: 48,
    AnnualIncome: 65000,
    CreditScore: 640,
    EmploymentStatus: "Employed",
    EducationLevel: "Associate",
    LoanAmount: 40000,
    LoanDuration: 72,
    MaritalStatus: "Married",
    NumberOfDependents: 3,
    HomeOwnershipStatus: "Mortgage",
    MonthlyDebtPayments: 1800,
    DebtToIncomeRatio: 0.52,
    BankruptcyHistory: 0,
    PreviousLoanDefaults: 0,
    PaymentHistory: 20,
  },
  {
    Age: 23,
    AnnualIncome: 42000,
    CreditScore: 680,
    EmploymentStatus: "Employed",
    EducationLevel: "Bachelor",
    LoanAmount: 10000,
    LoanDuration: 36,
    MaritalStatus: "Single",
    NumberOfDependents: 0,
    HomeOwnershipStatus: "Rent",
    MonthlyDebtPayments: 250,
    DebtToIncomeRatio: 0.2,
    BankruptcyHistory: 0,
    PreviousLoanDefaults: 0,
    PaymentHistory: 22,
  },
  {
    Age: 58,
    AnnualIncome: 110000,
    CreditScore: 750,
    EmploymentStatus: "Employed",
    EducationLevel: "Master",
    LoanAmount: 25000,
    LoanDuration: 48,
    MaritalStatus: "Married",
    NumberOfDependents: 2,
    HomeOwnershipStatus: "Own",
    MonthlyDebtPayments: 450,
    DebtToIncomeRatio: 0.16,
    BankruptcyHistory: 0,
    PreviousLoanDefaults: 0,
    PaymentHistory: 30,
  },
  {
    Age: 51,
    AnnualIncome: 38000,
    CreditScore: 490,
    EmploymentStatus: "Unemployed",
    EducationLevel: "High School",
    LoanAmount: 35000,
    LoanDuration: 96,
    MaritalStatus: "Single",
    NumberOfDependents: 4,
    HomeOwnershipStatus: "Rent",
    MonthlyDebtPayments: 1600,
    DebtToIncomeRatio: 0.6,
    BankruptcyHistory: 1,
    PreviousLoanDefaults: 1,
    PaymentHistory: 12,
  },
  {
    Age: 31,
    AnnualIncome: 60000,
    CreditScore: 650,
    EmploymentStatus: "Self-Employed",
    EducationLevel: "Bachelor",
    LoanAmount: 15000,
    LoanDuration: 48,
    MaritalStatus: "Single",
    NumberOfDependents: 1,
    HomeOwnershipStatus: "Rent",
    MonthlyDebtPayments: 500,
    DebtToIncomeRatio: 0.28,
    BankruptcyHistory: 0,
    PreviousLoanDefaults: 0,
    PaymentHistory: 24,
  },
  {
    Age: 45,
    AnnualIncome: 125000,
    CreditScore: 800,
    EmploymentStatus: "Employed",
    EducationLevel: "Doctorate",
    LoanAmount: 20000,
    LoanDuration: 36,
    MaritalStatus: "Married",
    NumberOfDependents: 1,
    HomeOwnershipStatus: "Own",
    MonthlyDebtPayments: 300,
    DebtToIncomeRatio: 0.12,
    BankruptcyHistory: 0,
    PreviousLoanDefaults: 0,
    PaymentHistory: 30,
  },
  {
    Age: 40,
    AnnualIncome: 70000,
    CreditScore: 690,
    EmploymentStatus: "Employed",
    EducationLevel: "Master",
    LoanAmount: 60000,
    LoanDuration: 96,
    MaritalStatus: "Married",
    NumberOfDependents: 2,
    HomeOwnershipStatus: "Mortgage",
    MonthlyDebtPayments: 1200,
    DebtToIncomeRatio: 0.42,
    BankruptcyHistory: 0,
    PreviousLoanDefaults: 0,
    PaymentHistory: 23,
  },
];

// Load selected sample into the form
function loadSample(index) {
  const sample = sampleApplicants[index];
  if (!sample) return;

  // Highlight selected button
  const buttons = document.querySelectorAll(".sample-btn");
  buttons.forEach((btn, i) => {
    if (i === index) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });

  document.getElementById("age").value = sample.Age;
  document.getElementById("annualIncome").value = sample.AnnualIncome;
  document.getElementById("creditScore").value = sample.CreditScore;
  document.getElementById("employmentStatus").value = sample.EmploymentStatus;
  document.getElementById("educationLevel").value = sample.EducationLevel;
  document.getElementById("loanAmount").value = sample.LoanAmount;
  document.getElementById("loanDuration").value = sample.LoanDuration;
  document.getElementById("maritalStatus").value = sample.MaritalStatus;
  document.getElementById("dependents").value = sample.NumberOfDependents;
  document.getElementById("homeOwnership").value = sample.HomeOwnershipStatus;
  document.getElementById("monthlyDebt").value = sample.MonthlyDebtPayments;
  document.getElementById("dti").value = sample.DebtToIncomeRatio;
  document.getElementById("bankruptcy").value = sample.BankruptcyHistory;
  document.getElementById("previousDefaults").value = sample.PreviousLoanDefaults;
  document.getElementById("paymentHistory").value = sample.PaymentHistory;

  // On smaller screens, scroll back to the form
  if (window.innerWidth <= 980) {
    document.getElementById("loanForm").scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }
}

// Reset the form
function resetForm() {
  document.getElementById("loanForm").reset();

  const buttons = document.querySelectorAll(".sample-btn");
  buttons.forEach((btn) => btn.classList.remove("active"));

  const resultBox = document.getElementById("result");
  resultBox.style.display = "none";
  resultBox.innerHTML = "";
  resultBox.className = "result-card";

  document.getElementById("loanForm").scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}

// --------------------------------------------------
// Field Guide Modal Controls
// --------------------------------------------------
function openGuideModal() {
  const modal = document.getElementById("guideModal");
  if (modal) {
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
  }
}

function closeGuideModal() {
  const modal = document.getElementById("guideModal");
  if (modal) {
    modal.classList.remove("active");
    document.body.style.overflow = "";
  }
}

function handleModalOverlayClick(event) {
  if (event.target && event.target.id === "guideModal") {
    closeGuideModal();
  }
}

// Close modal on Escape key press
document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    closeGuideModal();
  }
});