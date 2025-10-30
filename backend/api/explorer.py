from fastapi import APIRouter, HTTPException
import pandas as pd
from functools import lru_cache

router = APIRouter()

# --- Helper: Load and cache the cleaned dataset ---
# We load the data ONCE when this file is imported.
# This way, we don't read the CSV from disk on every single request.
@lru_cache()
def get_cleaned_data():
    """
    Loads and cleans the Telco Churn dataset.
    The @router.lru_cache() decorator caches the result, 
    so the file is only read from disk once.
    """
    try:
        DATA_PATH = "data/telco_customer_churn.csv"
        df = pd.read_csv(DATA_PATH)
        
        # Do the same basic cleaning as the notebook
        df['TotalCharges'] = pd.to_numeric(df['TotalCharges'], errors='coerce')
        df.dropna(inplace=True)
        
        # Drop customerID, we don't need it in the explorer
        df.drop(columns=['customerID'], inplace=True, errors='ignore')
        
        print("✅ Explorer data loaded and cleaned.")
        # Convert DataFrame to a list of dictionaries (JSON)
        return df.to_dict('records')

    except FileNotFoundError:
        print("❌ ERROR: data/telco_customer_churn.csv not found.")
        return None
    except Exception as e:
        print(f"❌ ERROR cleaning explorer data: {e}")
        return None

# --- Endpoint: Get All Customer Data ---
@router.get("/")
async def get_all_customer_data():
    """
    Returns the entire cleaned Telco Churn dataset as a JSON array.
    Your frontend will use this to build its interactive charts.
    """
    data = get_cleaned_data()
    
    if data is None:
        raise HTTPException(status_code=404, detail="Dataset not found or could not be loaded.")
    
    return data