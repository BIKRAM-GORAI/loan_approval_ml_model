"""
LoanIQ - Local Development Runner
Run this file to launch the LoanIQ web app locally:
    python run.py
Then open http://127.0.0.1:5000 in your browser.
"""

from app.app import app

if __name__ == "__main__":
    print("=" * 60)
    print(" Starting LoanIQ ML Web Application...")
    print(" Access the app at: http://127.0.0.1:5000")
    print("=" * 60)
    app.run(host="127.0.0.1", port=5000, debug=True)
