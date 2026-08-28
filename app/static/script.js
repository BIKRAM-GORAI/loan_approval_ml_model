
/* =========================================================
   LoanIQ Frontend
   ========================================================= */

const state = {
    currentPage: "dashboard",
    currentStep: 1,
    lastResult: null
};


/* =========================================================
   DOM HELPERS
   ========================================================= */

const $ = function(selector) {
    return document.querySelector(selector);
};

const $$ = function(selector) {
    return document.querySelectorAll(selector);
};


function getValue(id) {
    const element = document.getElementById(id);

    if (element) {
        return element.value;
    }

    return "";
}


function setValue(id, value) {
    const element = document.getElementById(id);

    if (element) {
        element.value = value;
    }
}


/* =========================================================
   PAGE NAVIGATION
   ========================================================= */

function navigate(page) {

    state.currentPage = page;

    $$(".page").forEach(function(pageElement) {
        pageElement.classList.remove("active");
    });

    const targetPage =
        document.getElementById(page + "Page");

    if (targetPage) {
        targetPage.classList.add("active");
    }

    $$(".nav-item").forEach(function(navItem) {

        navItem.classList.toggle(
            "active",
            navItem.dataset.page === page
        );

    });

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

    if (page === "assessment") {
        showStep(state.currentStep);
    }
}


/* =========================================================
   ASSESSMENT STEPS
   ========================================================= */

function showStep(step) {

    state.currentStep = Number(step);

    $$(".assessment-step").forEach(function(section) {
        section.classList.remove("active");
    });

    const target =
        document.querySelector(
            '[data-step-content="' + step + '"]'
        );

    if (target) {
        target.classList.add("active");
    }

    $$(".progress-step").forEach(function(progress) {

        const progressStep =
            Number(progress.dataset.step);

        progress.classList.remove(
            "active",
            "completed"
        );

        if (progressStep === state.currentStep) {
            progress.classList.add("active");
        }

        if (progressStep < state.currentStep) {
            progress.classList.add("completed");
        }

    });

    if (Number(step) === 4) {
        buildReview();
    }

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


/* =========================================================
   VALIDATION
   ========================================================= */

function validateStep(step) {

    const section =
        document.querySelector(
            '[data-step-content="' + step + '"]'
        );

    if (!section) {
        return true;
    }

    const requiredFields =
        section.querySelectorAll(
            "input[required], select[required]"
        );

    for (const field of requiredFields) {

        if (field.value === "") {

            markInvalid(field);

            return false;
        }

        if (
            field.type === "number" &&
            field.min !== "" &&
            Number(field.value) < Number(field.min)
        ) {

            markInvalid(field);

            return false;
        }

        if (
            field.type === "number" &&
            field.max !== "" &&
            Number(field.value) > Number(field.max)
        ) {

            markInvalid(field);

            return false;
        }
    }

    return true;
}


function markInvalid(field) {

    if (field.type === "hidden") {

        const buttons =
            document.querySelectorAll(
                '[data-target="' + field.id + '"]'
            );

        if (buttons.length > 0) {
            buttons[0].scrollIntoView({
                behavior: "smooth",
                block: "center"
            });
        }

        return;
    }

    field.focus();

    field.style.borderColor =
        "#c63d4d";

    setTimeout(function() {

        field.style.borderColor = "";

    }, 1600);
}


/* =========================================================
   CHOICE BUTTONS
   ========================================================= */

function setupChoiceButtons() {

    $$(".choice-btn, .binary-btn")
        .forEach(function(button) {

            button.addEventListener(
                "click",
                function() {

                    const targetId =
                        button.dataset.target;

                    const value =
                        button.dataset.value;

                    const target =
                        document.getElementById(targetId);

                    if (!target) {
                        return;
                    }

                    target.value = value;

                    document
                        .querySelectorAll(
                            '[data-target="' +
                            targetId +
                            '"]'
                        )
                        .forEach(function(item) {

                            item.classList.remove(
                                "selected"
                            );

                        });

                    button.classList.add(
                        "selected"
                    );
                }
            );

        });
}


/* =========================================================
   STEPPER
   ========================================================= */

function setupSteppers() {

    $$(".stepper-btn")
        .forEach(function(button) {

            button.addEventListener(
                "click",
                function() {

                    const target =
                        document.getElementById(
                            button.dataset.target
                        );

                    if (!target) {
                        return;
                    }

                    let value =
                        Number(
                            target.value || 0
                        );

                    if (
                        button.dataset.action ===
                        "increase"
                    ) {

                        value += 1;
                    }

                    if (
                        button.dataset.action ===
                        "decrease"
                    ) {

                        value = Math.max(
                            Number(
                                target.min || 0
                            ),
                            value - 1
                        );
                    }

                    target.value = value;
                }
            );

        });
}


/* =========================================================
   RANGE INPUTS
   ========================================================= */

function setupRanges() {

    const duration =
        $("#loanDuration");

    if (duration) {

        duration.addEventListener(
            "input",
            function() {

                const output =
                    $("#durationValue");

                if (output) {
                    output.textContent =
                        duration.value;
                }
            }
        );
    }


    const dti =
        $("#dti");

    if (dti) {

        dti.addEventListener(
            "input",
            function() {

                const percentage =
                    Number(dti.value);

                const output =
                    $("#dtiValue");

                if (output) {
                    output.textContent =
                        percentage;
                }

                const raw =
                    $("#dtiRaw");

                if (raw) {
                    raw.value =
                        percentage / 100;
                }
            }
        );

        $("#dtiRaw").value =
            Number(dti.value) / 100;
    }


    const credit =
        $("#creditScore");

    if (credit) {

        credit.addEventListener(
            "input",
            function() {

                const score =
                    Number(credit.value);

                const output =
                    $("#creditScoreValue");

                if (output) {
                    output.textContent =
                        score;
                }

                updateCreditIndicator(score);
            }
        );

        updateCreditIndicator(
            Number(credit.value)
        );
    }


    const paymentHistory =
        $("#paymentHistory");

    if (paymentHistory) {

        paymentHistory.addEventListener(
            "input",
            function() {

                const output =
                    $("#paymentHistoryValue");

                if (output) {
                    output.textContent =
                        paymentHistory.value;
                }
            }
        );
    }
}


/* =========================================================
   CREDIT INDICATOR
   ========================================================= */

function updateCreditIndicator(score) {

    const indicator =
        $("#creditIndicator");

    if (!indicator) {
        return;
    }

    if (score >= 750) {

        indicator.textContent =
            "Excellent credit profile";

    } else if (score >= 700) {

        indicator.textContent =
            "Strong credit profile";

    } else if (score >= 650) {

        indicator.textContent =
            "Moderate credit profile";

    } else {

        indicator.textContent =
            "Credit profile needs attention";
    }
}


/* =========================================================
   COLLECT APPLICATION DATA
   ========================================================= */

function collectApplicationData() {

    const dtiPercentage =
        Number(
            getValue("dti")
        );

    return {

        Age: Number(
            getValue("age")
        ),

        AnnualIncome: Number(
            getValue("annualIncome")
        ),

        CreditScore: Number(
            getValue("creditScore")
        ),

        EmploymentStatus:
            getValue("employmentStatus"),

        EducationLevel:
            getValue("educationLevel"),

        LoanAmount: Number(
            getValue("loanAmount")
        ),

        LoanDuration: Number(
            getValue("loanDuration")
        ),

        MaritalStatus:
            getValue("maritalStatus"),

        NumberOfDependents: Number(
            getValue("dependents")
        ),

        HomeOwnershipStatus:
            getValue("homeOwnershipStatus"),

        MonthlyDebtPayments: Number(
            getValue("monthlyDebtPayments")
        ),

        DebtToIncomeRatio:
            dtiPercentage / 100,

        BankruptcyHistory: Number(
            getValue("bankruptcy")
        ),

        PreviousLoanDefaults: Number(
            getValue("previousDefaults")
        ),

        PaymentHistory: Number(
            getValue("paymentHistory")
        )
    };
}


/* =========================================================
   REVIEW PAGE
   ========================================================= */

function addReviewItem(
    container,
    label,
    value
) {

    const item =
        document.createElement("div");

    item.className =
        "review-item";


    const labelElement =
        document.createElement("span");

    labelElement.textContent =
        label;


    const valueElement =
        document.createElement("strong");

    valueElement.textContent =
        value;


    item.appendChild(
        labelElement
    );

    item.appendChild(
        valueElement
    );

    container.appendChild(
        item
    );
}


function formatCurrency(value) {

    return new Intl.NumberFormat(
        "en-US",
        {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 0
        }
    ).format(
        Number(value)
    );
}


function buildReview() {

    const data =
        collectApplicationData();


    const applicant =
        $("#applicantReview");

    const financial =
        $("#financialReview");

    const credit =
        $("#creditReview");


    if (!applicant ||
        !financial ||
        !credit) {

        return;
    }


    applicant.innerHTML = "";
    financial.innerHTML = "";
    credit.innerHTML = "";


    addReviewItem(
        applicant,
        "Age",
        data.Age + " years"
    );

    addReviewItem(
        applicant,
        "Employment",
        data.EmploymentStatus
    );

    addReviewItem(
        applicant,
        "Education",
        data.EducationLevel
    );

    addReviewItem(
        applicant,
        "Marital status",
        data.MaritalStatus
    );

    addReviewItem(
        applicant,
        "Dependents",
        data.NumberOfDependents
    );

    addReviewItem(
        applicant,
        "Home ownership",
        data.HomeOwnershipStatus
    );


    addReviewItem(
        financial,
        "Annual income",
        formatCurrency(
            data.AnnualIncome
        )
    );

    addReviewItem(
        financial,
        "Requested loan",
        formatCurrency(
            data.LoanAmount
        )
    );

    addReviewItem(
        financial,
        "Loan duration",
        data.LoanDuration +
        " months"
    );

    addReviewItem(
        financial,
        "Monthly debt",
        formatCurrency(
            data.MonthlyDebtPayments
        )
    );

    addReviewItem(
        financial,
        "DTI ratio",
        Math.round(
            data.DebtToIncomeRatio * 100
        ) + "%"
    );


    addReviewItem(
        credit,
        "Credit score",
        data.CreditScore
    );

    addReviewItem(
        credit,
        "Payment history",
        data.PaymentHistory +
        " / 30"
    );

    addReviewItem(
        credit,
        "Previous defaults",
        data.PreviousLoanDefaults === 1
            ? "Yes"
            : "No"
    );

    addReviewItem(
        credit,
        "Previous bankruptcy",
        data.BankruptcyHistory === 1
            ? "Yes"
            : "No"
    );
}


/* =========================================================
   FEEDBACK ENGINE
   ========================================================= */

/*
 * IMPORTANT:
 *
 * This feedback is NOT claiming to explain the ML model.
 *
 * It evaluates the submitted application values using
 * transparent rules and presents them as application
 * feedback.
 *
 * The model prediction itself still comes from /api/predict.
 */


function createFeedbackItem(
    type,
    title,
    message
) {

    const card =
        document.createElement("div");

    card.className =
        "feedback-card " + type;


    const icon =
        document.createElement("div");

    icon.className =
        "feedback-icon";


    if (type === "positive") {
        icon.textContent = "✓";
    } else {
        icon.textContent = "!";
    }


    const content =
        document.createElement("div");


    const heading =
        document.createElement("h4");

    heading.textContent =
        title;


    const paragraph =
        document.createElement("p");

    paragraph.textContent =
        message;


    content.appendChild(
        heading
    );

    content.appendChild(
        paragraph
    );


    card.appendChild(
        icon
    );

    card.appendChild(
        content
    );


    return card;
}


/* =========================================================
   GENERATE FEEDBACK
   ========================================================= */

function generateFeedback(data) {

    const strengths =
        [];

    const improvements =
        [];


    /* -----------------------------------------------------
       CREDIT SCORE
       ----------------------------------------------------- */

    if (data.CreditScore >= 750) {

        strengths.push({
            title:
                "Excellent credit profile",

            message:
                "Your credit score is a strong part of this application and indicates a well-established credit profile."
        });

    } else if (data.CreditScore >= 700) {

        strengths.push({
            title:
                "Strong credit score",

            message:
                "Your credit score is a positive part of the application."
        });

    } else if (data.CreditScore < 650) {

        improvements.push({
            title:
                "Credit score",

            message:
                "Improving your credit profile over time could strengthen future loan applications."
        });
    }


    /* -----------------------------------------------------
       DTI
       ----------------------------------------------------- */

    const dti =
        data.DebtToIncomeRatio;


    if (dti <= 0.20) {

        strengths.push({
            title:
                "Healthy debt-to-income ratio",

            message:
                "Your existing debt represents a relatively small share of your income."
        });

    } else if (dti <= 0.35) {

        strengths.push({
            title:
                "Manageable debt-to-income ratio",

            message:
                "Your debt-to-income ratio is within a moderate range."
        });

    } else if (dti > 0.40) {

        improvements.push({
            title:
                "High debt-to-income ratio",

            message:
                "Reducing existing debt relative to income could strengthen your overall financial profile."
        });
    }


    /* -----------------------------------------------------
       PAYMENT HISTORY
       ----------------------------------------------------- */

    if (data.PaymentHistory >= 28) {

        strengths.push({
            title:
                "Strong payment history",

            message:
                "Your payment history shows a high level of consistency."
        });

    } else if (data.PaymentHistory >= 24) {

        strengths.push({
            title:
                "Generally consistent payments",

            message:
                "Your payment history is relatively consistent."
        });

    } else if (data.PaymentHistory < 20) {

        improvements.push({
            title:
                "Payment history",

            message:
                "Maintaining consistent, on-time payments can help strengthen your credit profile over time."
        });
    }


    /* -----------------------------------------------------
       PREVIOUS DEFAULTS
       ----------------------------------------------------- */

    if (
        data.PreviousLoanDefaults === 0
    ) {

        strengths.push({
            title:
                "No previous loan defaults",

            message:
                "The application does not report previous loan defaults."
        });

    } else {

        improvements.push({
            title:
                "Previous loan defaults",

            message:
                "Previous defaults are an area that may affect how future applications are viewed. Maintaining consistent repayment behaviour can help over time."
        });
    }


    /* -----------------------------------------------------
       BANKRUPTCY
       ----------------------------------------------------- */

    if (
        data.BankruptcyHistory === 0
    ) {

        strengths.push({
            title:
                "No previous bankruptcy reported",

            message:
                "The application does not report a previous bankruptcy."
        });

    } else {

        improvements.push({
            title:
                "Previous bankruptcy reported",

            message:
                "A previous bankruptcy is an important part of the credit profile and may make future borrowing more challenging."
        });
    }


    /* -----------------------------------------------------
       INCOME
       ----------------------------------------------------- */

    if (
        data.AnnualIncome > 0 &&
        data.LoanAmount > 0
    ) {

        const loanToIncome =
            data.LoanAmount /
            data.AnnualIncome;


        if (loanToIncome <= 0.30) {

            strengths.push({
                title:
                    "Moderate requested loan",

                message:
                    "The requested loan amount is relatively modest compared with annual income."
            });

        } else if (
            loanToIncome > 0.75
        ) {

            improvements.push({
                title:
                    "Large requested loan relative to income",

                message:
                    "A lower requested amount could reduce the financial burden relative to annual income."
            });
        }
    }


    /* -----------------------------------------------------
       EMPLOYMENT
       ----------------------------------------------------- */

    if (
        data.EmploymentStatus ===
        "Employed"
    ) {

        strengths.push({
            title:
                "Employed applicant",

            message:
                "The application reports current employment."
        });
    }


    /* -----------------------------------------------------
       FALLBACK FEEDBACK
       ----------------------------------------------------- */

    if (
        strengths.length === 0
    ) {

        strengths.push({
            title:
                "Application submitted",

            message:
                "The application contains the information required for the LoanIQ assessment."
        });
    }


    if (
        improvements.length === 0
    ) {

        improvements.push({
            title:
                "Maintain the current profile",

            message:
                "No major improvement area was identified by the current application feedback rules. Continuing healthy financial and repayment habits can help preserve this profile."
        });
    }


    return {
        strengths:
            strengths,

        improvements:
            improvements
    };
}


/* =========================================================
   RENDER FEEDBACK
   ========================================================= */

function renderFeedback(data) {

    const result =
        generateFeedback(data);


    const strengthsContainer =
        $("#strengthsContainer");

    const improvementsContainer =
        $("#improvementsContainer");


    if (
        !strengthsContainer ||
        !improvementsContainer
    ) {

        return;
    }


    strengthsContainer.innerHTML = "";

    improvementsContainer.innerHTML = "";


    result.strengths.forEach(
        function(item) {

            strengthsContainer.appendChild(
                createFeedbackItem(
                    "positive",
                    item.title,
                    item.message
                )
            );

        }
    );


    result.improvements.forEach(
        function(item) {

            improvementsContainer.appendChild(
                createFeedbackItem(
                    "negative",
                    item.title,
                    item.message
                )
            );

        }
    );


    updateKeyFocus(
        data,
        result
    );
}


/* =========================================================
   KEY FOCUS
   ========================================================= */

function updateKeyFocus(
    data,
    feedback
) {

    const title =
        $("#focusTitle");

    const message =
        $("#focusMessage");


    if (!title || !message) {
        return;
    }


    /*
     * Prioritize the most actionable
     * improvement area.
     */

    if (
        data.CreditScore < 650
    ) {

        title.textContent =
            "Strengthen your credit profile";

        message.textContent =
            "Credit score is the clearest improvement area in this application. Focus on consistent repayment behaviour and maintaining healthy credit usage over time.";

        return;
    }


    if (
        data.DebtToIncomeRatio > 0.40
    ) {

        title.textContent =
            "Reduce debt relative to income";

        message.textContent =
            "Your debt-to-income ratio is the clearest area for improvement. Reducing existing debt or increasing income could strengthen the financial profile.";

        return;
    }


    if (
        data.PaymentHistory < 20
    ) {

        title.textContent =
            "Build stronger payment consistency";

        message.textContent =
            "Payment history is an important area to work on. Consistent, on-time payments can strengthen the profile over time.";

        return;
    }


    if (
        data.PreviousLoanDefaults === 1
    ) {

        title.textContent =
            "Maintain consistent repayment behaviour";

        message.textContent =
            "Previous defaults are present in the application. Building a consistent repayment record can help strengthen future applications.";

        return;
    }


    if (
        data.BankruptcyHistory === 1
    ) {

        title.textContent =
            "Focus on long-term credit recovery";

        message.textContent =
            "A previous bankruptcy is reported. Maintaining stable finances and consistent repayment behaviour can help strengthen the profile over time.";

        return;
    }


    if (
        feedback.improvements.length > 0
    ) {

        title.textContent =
            "Keep improving the financial profile";

        message.textContent =
            feedback.improvements[0].message;

        return;
    }


    title.textContent =
        "Maintain the current profile";

    message.textContent =
        "The application shows several positive characteristics. Maintaining consistent payments, manageable debt and healthy credit habits can help preserve the profile.";
}


/* =========================================================
   API REQUEST
   ========================================================= */

async function submitAssessment(event) {

    event.preventDefault();


    if (
        !validateStep(4)
    ) {

        return;
    }


    const data =
        collectApplicationData();


    const loading =
        $("#loadingOverlay");


    if (loading) {
        loading.classList.add(
            "active"
        );
    }


    try {

        const response =
            await fetch(
                "/api/predict",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(data)
                }
            );


        const result =
            await response.json();


        if (!response.ok) {

            throw new Error(
                result.error ||
                "Unable to generate the assessment."
            );
        }


        state.lastResult = {

            prediction:
                result.prediction,

            result:
                result.result,

            approval_probability:
                result.approval_probability,

            application:
                data
        };


        renderResult(
            state.lastResult
        );


        navigate(
            "results"
        );


    } catch (error) {

        console.error(
            "Prediction error:",
            error
        );


        alert(
            error.message ||
            "Something went wrong while generating the assessment."
        );


    } finally {

        if (loading) {
            loading.classList.remove(
                "active"
            );
        }
    }
}


/* =========================================================
   RESULT PAGE
   ========================================================= */

function renderResult(result) {

    const approved =
        result.prediction === 1 ||
        result.result === "Approved";


    let probability;


    if (
        typeof result.approval_probability ===
        "number"
    ) {

        probability =
            result.approval_probability;

    } else {

        probability =
            approved ? 1 : 0;
    }


    const percentage =
        Math.round(
            probability * 1000
        ) / 10;


    const hero =
        $("#resultHero");


    if (hero) {

        hero.classList.toggle(
            "rejected",
            !approved
        );
    }


    const title =
        $("#resultTitle");

    if (title) {

        title.textContent =
            approved
                ? "Approved"
                : "Rejected";
    }


    const message =
        $("#resultMessage");

    if (message) {

        message.textContent =
            approved
                ? "The model predicts a positive approval outcome for this application."
                : "The model predicts a negative approval outcome for this application.";
    }


    const probabilityValue =
        $("#probabilityValue");

    if (probabilityValue) {

        probabilityValue.textContent =
            percentage + "%";
    }


    const probabilityFill =
        $("#probabilityFill");

    if (probabilityFill) {

        probabilityFill.style.width =
            Math.max(
                0,
                Math.min(
                    100,
                    percentage
                )
            ) + "%";
    }


    const data =
        result.application;


    renderResultSummary(
        data
    );


    renderFeedback(
        data
    );
}


/* =========================================================
   RESULT SUMMARY
   ========================================================= */

function renderResultSummary(
    data
) {

    const summary =
        $("#resultSummary");


    if (!summary) {
        return;
    }


    summary.innerHTML = "";


    addResultItem(
        summary,
        "Annual income",
        formatCurrency(
            data.AnnualIncome
        )
    );


    addResultItem(
        summary,
        "Requested loan",
        formatCurrency(
            data.LoanAmount
        )
    );


    addResultItem(
        summary,
        "Credit score",
        data.CreditScore
    );


    addResultItem(
        summary,
        "DTI ratio",
        Math.round(
            data.DebtToIncomeRatio * 100
        ) + "%"
    );


    addResultItem(
        summary,
        "Loan duration",
        data.LoanDuration +
        " months"
    );


    addResultItem(
        summary,
        "Employment",
        data.EmploymentStatus
    );
}


function addResultItem(
    container,
    label,
    value
) {

    const item =
        document.createElement("div");

    item.className =
        "result-summary-item";


    const labelElement =
        document.createElement("span");

    labelElement.textContent =
        label;


    const valueElement =
        document.createElement("strong");

    valueElement.textContent =
        value;


    item.appendChild(
        labelElement
    );

    item.appendChild(
        valueElement
    );


    container.appendChild(
        item
    );
}


/* =========================================================
   RESET ASSESSMENT
   ========================================================= */

function resetAssessment() {

    const form =
        $("#loanForm");


    if (form) {
        form.reset();
    }


    setValue(
        "maritalStatus",
        ""
    );

    setValue(
        "homeOwnershipStatus",
        ""
    );

    setValue(
        "previousDefaults",
        ""
    );

    setValue(
        "bankruptcy",
        ""
    );


    $$(".choice-btn, .binary-btn")
        .forEach(function(button) {

            button.classList.remove(
                "selected"
            );

        });


    setValue(
        "dependents",
        0
    );


    setValue(
        "loanDuration",
        36
    );


    if ($("#durationValue")) {

        $("#durationValue")
            .textContent = "36";
    }


    setValue(
        "dti",
        25
    );


    if ($("#dtiValue")) {

        $("#dtiValue")
            .textContent = "25";
    }


    setValue(
        "dtiRaw",
        0.25
    );


    setValue(
        "creditScore",
        720
    );


    if ($("#creditScoreValue")) {

        $("#creditScoreValue")
            .textContent = "720";
    }


    setValue(
        "paymentHistory",
        28
    );


    if ($("#paymentHistoryValue")) {

        $("#paymentHistoryValue")
            .textContent = "28";
    }


    updateCreditIndicator(
        720
    );


    state.currentStep =
        1;


    showStep(
        1
    );
}


/* =========================================================
   SAMPLE CASES
   ========================================================= */

const sampleCases = [

    {
        Age: 35,
        AnnualIncome: 95000,
        CreditScore: 760,
        EmploymentStatus: "Employed",
        EducationLevel: "Bachelor",
        LoanAmount: 25000,
        LoanDuration: 36,
        MaritalStatus: "Married",
        NumberOfDependents: 1,
        HomeOwnershipStatus: "Mortgage",
        MonthlyDebtPayments: 450,
        DebtToIncomeRatio: 0.18,
        BankruptcyHistory: 0,
        PreviousLoanDefaults: 0,
        PaymentHistory: 29
    },


    {
        Age: 42,
        AnnualIncome: 48000,
        CreditScore: 540,
        EmploymentStatus: "Employed",
        EducationLevel: "High School",
        LoanAmount: 30000,
        LoanDuration: 60,
        MaritalStatus: "Single",
        NumberOfDependents: 2,
        HomeOwnershipStatus: "Rent",
        MonthlyDebtPayments: 1200,
        DebtToIncomeRatio: 0.48,
        BankruptcyHistory: 0,
        PreviousLoanDefaults: 1,
        PaymentHistory: 17
    },


    {
        Age: 38,
        AnnualIncome: 125000,
        CreditScore: 800,
        EmploymentStatus: "Employed",
        EducationLevel: "Master",
        LoanAmount: 20000,
        LoanDuration: 36,
        MaritalStatus: "Married",
        NumberOfDependents: 0,
        HomeOwnershipStatus: "Own",
        MonthlyDebtPayments: 300,
        DebtToIncomeRatio: 0.12,
        BankruptcyHistory: 0,
        PreviousLoanDefaults: 0,
        PaymentHistory: 30
    },


    {
        Age: 31,
        AnnualIncome: 60000,
        CreditScore: 650,
        EmploymentStatus: "Self-Employed",
        EducationLevel: "Bachelor",
        LoanAmount: 60000,
        LoanDuration: 96,
        MaritalStatus: "Single",
        NumberOfDependents: 1,
        HomeOwnershipStatus: "Rent",
        MonthlyDebtPayments: 900,
        DebtToIncomeRatio: 0.35,
        BankruptcyHistory: 0,
        PreviousLoanDefaults: 0,
        PaymentHistory: 24
    }
];


function loadSample(index) {

    const data =
        sampleCases[index];


    if (!data) {
        return;
    }


    setValue(
        "age",
        data.Age
    );

    setValue(
        "annualIncome",
        data.AnnualIncome
    );

    setValue(
        "creditScore",
        data.CreditScore
    );

    setValue(
        "employmentStatus",
        data.EmploymentStatus
    );

    setValue(
        "educationLevel",
        data.EducationLevel
    );

    setValue(
        "loanAmount",
        data.LoanAmount
    );

    setValue(
        "loanDuration",
        data.LoanDuration
    );

    setValue(
        "maritalStatus",
        data.MaritalStatus
    );

    setValue(
        "dependents",
        data.NumberOfDependents
    );

    setValue(
        "homeOwnershipStatus",
        data.HomeOwnershipStatus
    );

    setValue(
        "monthlyDebtPayments",
        data.MonthlyDebtPayments
    );

    setValue(
        "dti",
        Math.round(
            data.DebtToIncomeRatio * 100
        )
    );

    setValue(
        "dtiRaw",
        data.DebtToIncomeRatio
    );

    setValue(
        "bankruptcy",
        data.BankruptcyHistory
    );

    setValue(
        "previousDefaults",
        data.PreviousLoanDefaults
    );

    setValue(
        "paymentHistory",
        data.PaymentHistory
    );


    if ($("#durationValue")) {

        $("#durationValue")
            .textContent =
            data.LoanDuration;
    }


    if ($("#dtiValue")) {

        $("#dtiValue")
            .textContent =
            Math.round(
                data.DebtToIncomeRatio * 100
            );
    }


    if ($("#creditScoreValue")) {

        $("#creditScoreValue")
            .textContent =
            data.CreditScore;
    }


    if ($("#paymentHistoryValue")) {

        $("#paymentHistoryValue")
            .textContent =
            data.PaymentHistory;
    }


    updateCreditIndicator(
        data.CreditScore
    );


    $$(".choice-btn, .binary-btn")
        .forEach(function(button) {

            const target =
                button.dataset.target;


            if (!target) {
                return;
            }


            button.classList.toggle(
                "selected",
                button.dataset.value ===
                String(
                    getValue(target)
                )
            );

        });


    state.currentStep =
        1;


    navigate(
        "assessment"
    );


    showStep(
        1
    );
}


/* =========================================================
   NAVIGATION EVENTS
   ========================================================= */

function setupNavigation() {

    $$(".nav-item")
        .forEach(function(button) {

            button.addEventListener(
                "click",
                function() {

                    navigate(
                        button.dataset.page
                    );

                }
            );

        });


    const dashboardButton =
        $("#dashboardNewAssessment");


    if (dashboardButton) {

        dashboardButton.addEventListener(
            "click",
            function() {

                resetAssessment();

                navigate(
                    "assessment"
                );

            }
        );
    }


    const heroButton =
        $("#heroStart");


    if (heroButton) {

        heroButton.addEventListener(
            "click",
            function() {

                resetAssessment();

                navigate(
                    "assessment"
                );

            }
        );
    }


    const resultButton =
        $("#resultNewAssessment");


    if (resultButton) {

        resultButton.addEventListener(
            "click",
            function() {

                resetAssessment();

                navigate(
                    "assessment"
                );

            }
        );
    }


    const resetButton =
        $("#resetAssessment");


    if (resetButton) {

        resetButton.addEventListener(
            "click",
            function() {

                resetAssessment();

            }
        );
    }
}


/* =========================================================
   STEP NAVIGATION
   ========================================================= */

function setupStepNavigation() {

    $$(".next-btn")
        .forEach(function(button) {

            button.addEventListener(
                "click",
                function() {

                    const nextStep =
                        Number(
                            button.dataset.next
                        );


                    if (
                        !validateStep(
                            state.currentStep
                        )
                    ) {

                        return;
                    }


                    showStep(
                        nextStep
                    );

                }
            );

        });


    $$(".back-btn")
        .forEach(function(button) {

            button.addEventListener(
                "click",
                function() {

                    const previousStep =
                        Number(
                            button.dataset.back
                        );

                    showStep(
                        previousStep
                    );

                }
            );

        });


    $$(".edit-section")
        .forEach(function(button) {

            button.addEventListener(
                "click",
                function() {

                    const step =
                        Number(
                            button.dataset.step
                        );

                    showStep(
                        step
                    );

                }
            );

        });
}


/* =========================================================
   SAMPLE EVENTS
   ========================================================= */

function setupSamples() {

    $$(".sample-card")
        .forEach(function(card) {

            card.addEventListener(
                "click",
                function() {

                    const index =
                        Number(
                            card.dataset.sample
                        );

                    loadSample(
                        index
                    );

                }
            );

        });
}


/* =========================================================
   APPLICATION STARTUP
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        setupNavigation();

        setupStepNavigation();

        setupChoiceButtons();

        setupSteppers();

        setupRanges();

        setupSamples();


        const loanForm =
            $("#loanForm");


        if (loanForm) {

            loanForm.addEventListener(
                "submit",
                submitAssessment
            );

        }


        navigate(
            "dashboard"
        );
    }
);
