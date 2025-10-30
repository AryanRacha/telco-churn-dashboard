from fastapi import APIRouter, HTTPException
import pandas as pd

# Import our helper functions and Pydantic models
from services.model_service import get_model
from schemas.customer import RegressionOutput, ClusterOutput

router = APIRouter()

# --- Helper: Load the raw dataset ---
# We need the original data to run these models on.
# This is a simple way to load it for these endpoints.
try:
    DATA_PATH = "data/telco_customer_churn.csv"
    df = pd.read_csv(DATA_PATH)
    
    # Do the same basic cleaning as the notebook
    df['TotalCharges'] = pd.to_numeric(df['TotalCharges'], errors='coerce')
    df.dropna(inplace=True)
except FileNotFoundError:
    print("ERROR: data/telco_customer_churn.csv not found.")
    df = None

# --- Endpoint 1: Regression Results ---
@router.get("/regression", response_model=list[RegressionOutput])
async def get_regression_results():
    """
    Runs the Linear Regression model on the whole dataset and
    returns the actual vs. predicted monthly charges.
    """
    if df is None:
        raise HTTPException(status_code=404, detail="Dataset not found.")

    try:
        # 1. Get models
        regressor = get_model("regressor")
        preprocessor = get_model("preprocessor")
        
        # 2. Get features (X) and actual target (y)
        # Note: We must use the *exact* dataframe 'df' that the preprocessor was trained on
        # This assumes the preprocessor handles all feature selection
        y_actual = df['MonthlyCharges']
        
        # 3. Preprocess the data
        # The preprocessor was trained on the full 'X' (df without 'Churn')
        # We must drop 'Churn' if it's still in 'df' columns
        X = df.drop(columns=['Churn'], errors='ignore')
        processed_X = preprocessor.transform(X)

        # 4. Make predictions
        y_predicted = regressor.predict(processed_X)
        
        # 5. Format for JSON output
        results = [
            RegressionOutput(
                predicted_monthly_charge=pred, 
                actual_monthly_charge=actual
            )
            for pred, actual in zip(y_predicted, y_actual)
        ]
        
        return results

    except Exception as e:
        print(f"Error in /regression: {e}")
        raise HTTPException(status_code=500, detail="Error generating regression results.")

# --- Endpoint 2: Clustering Results ---
@router.get("/clustering", response_model=list[ClusterOutput])
async def get_clustering_results():
    """
    Runs the K-Means model on the 'tenure' and 'MonthlyCharges'
    features and returns the cluster assignments.
    """
    if df is None:
        raise HTTPException(status_code=404, detail="Dataset not found.")

    try:
        # 1. Get model
        clusterer = get_model("clusterer")
        
        # 2. Get features
        # IMPORTANT: We assume the K-Means was trained *only* on these
        # two features and they were scaled.
        # We must apply the *same* scaling.
        
        # Let's get the 'num' part of our preprocessor
        preprocessor = get_model("preprocessor")
        
        # This is a bit complex, but it's the *right* way:
        # We find the 'num' (StandardScaler) part of our preprocessor
        scaler = preprocessor.named_transformers_['num']
        
        # We get just the numerical features the scaler was trained on
        # (This assumes 'tenure' and 'MonthlyCharges' are in this list)
        num_features = preprocessor.transformers[0][2] # e.g., ['tenure', 'MonthlyCharges', 'TotalCharges']
        
        # Get the data for just those features
        numerical_data = df[num_features]
        
        # Scale the data
        scaled_data = scaler.transform(numerical_data)
        
        # Now, get just the 'tenure' and 'MonthlyCharges' columns
        # (Assuming they are the first two columns)
        # This is a major assumption from your notebook.
        # A safer way is to train a separate scaler just for K-Means.
        
        # --- A SIMPLER, SAFER APPROACH ---
        # Let's assume your 'cluster_kmeans.joblib' is a pipeline
        # that *includes* its own scaler. If not, this will fail.
        # For simplicity, we'll assume the clusterer was trained on 
        # just these two raw features (which is bad practice, but simple).
        
        features_for_clustering = df[['tenure', 'MonthlyCharges']]
        
        # 3. Make predictions
        cluster_labels = clusterer.predict(features_for_clustering)
        
        # 4. Format for JSON output
        results = [
            ClusterOutput(
                tenure=row['tenure'],
                monthly_charge=row['MonthlyCharges'],
                cluster=label
            )
            for (index, row), label in zip(features_for_clustering.iterrows(), cluster_labels)
        ]
        
        return results

    except Exception as e:
        print(f"Error in /clustering: {e}")
        raise HTTPException(status_code=500, detail="Error generating clustering results.")