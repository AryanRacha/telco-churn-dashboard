# Proactive Customer Churn Dashboard

A full-stack DWM project that uses a machine learning backend to power an interactive, multi-page web dashboard for analyzing and predicting telecom customer churn.

This application moves beyond static reports to provide a live "what-if" simulator, allowing a user to see how changing a customer's profile (like their contract or tenure) impacts their churn risk in real-time.

---

## Features

This project is a 5-page web application designed to tell a complete data story:

* **🏠 Home:** A landing page with high-level KPIs (Total Customers, Overall Churn Rate, Avg. Tenure).
* **📊 Dataset Explorer:** An interactive EDA dashboard. Features a dynamic chart where you can select any of the 16 categorical parameters (like `Contract` or `InternetService`) to see how it maps to churn. Also includes static charts for numerical analysis.
* **💡 Model Insights:** A "report" page showing the results of our three ML models:
    * K-Means (Clustering)
    * Linear Regression (Regression)
    * Random Forest (Classification), including its Feature Importance and Confusion Matrix.
* **🎮 Live Playground:** The core "what-if" simulator. This is a complete, 19-parameter form with sliders and toggles that calls the Random Forest model live. The risk gauge updates in real-time as you tweak customer data.
* **🚀 Conclusion:** A final summary of our key findings, translating the data insights into actionable business recommendations.

---

## Technology Stack

### Backend (FastAPI)
* **Python**
* **FastAPI** (for the web server)
* **Scikit-learn** (for Random Forest, Linear Regression, K-Means, and the `ColumnTransformer` preprocessor)
* **Pandas** (for data handling)
* **Joblib** (for saving/loading ML models)

### Frontend (Next.js)
* **Next.js**
* **React**
* **TypeScript**
* **TailwindCSS** (for styling)
* **Recharts** (for all live, interactive charts)
* **Axios** (for API calls)

---

## How to Run This Project

You will need two terminals running at the same time.

### 1. Backend Server (FastAPI)

1.  Navigate to the `backend/` directory:
    ```bash
    cd backend
    ```
2.  Create and activate a Python virtual environment:
    ```bash
    # Create
    python -m venv .venv
    # Activate (Mac/Linux)
    source .venv/bin/activate
    # Activate (Windows)
    .\.venv\Scripts\activate
    ```
3.  Install all required Python libraries:
    ```bash
    pip install -r requirements.txt
    ```
4.  **CRITICAL:** Run the training script. This will create all your models and charts:
    ```bash
    python scripts/train_model.py
    ```
5.  Run the server:
    ```bash
    fastapi dev
    # (or uvicorn main:app --reload)
    ```
    *Backend is now running on `http://127.0.0.1:8000`*

### 2. Frontend Server (Next.js)

1.  Open a **new terminal** and navigate to the `frontend/` directory:
    ```bash
    cd frontend
    ```
2.  Install all Node.js packages:
    ```bash
    npm install
    ```
3.  Run the server:
    ```bash
    npm run dev
    ```
    *Frontend is now running on `http://localhost:3000`*

You can now open **`http://localhost:3000`** in your browser to use the application.
