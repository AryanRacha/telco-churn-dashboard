import joblib
import os
import pandas as pd
from typing import Dict, Any

# Import our Pydantic schema
from schemas.customer import CustomerInput

# --- 1. DEFINE MODEL PATHS ---
MODEL_DIR = os.path.join(os.path.dirname(__file__), '..', 'models')
PREPROCESSOR_PATH = os.path.join(MODEL_DIR, "preprocessor.joblib")
CLASSIFIER_PATH = os.path.join(MODEL_DIR, "classifier_rf.joblib")
REGRESSOR_PATH = os.path.join(MODEL_DIR, "regression_linear.joblib")
CLUSTER_PATH = os.path.join(MODEL_DIR, "cluster_kmeans.joblib")


# --- 2. CREATE A "CACHE" FOR MODELS ---
models: Dict[str, Any] = {
    "preprocessor": None,
    "classifier": None,
    "regressor": None,
    "clusterer": None
}


# --- 3. MODEL LOADING FUNCTION ---
def load_all_models():
    """
    Loads all ML models from disk into the 'models' dictionary.
    This is called ONCE on server startup by main.py.
    """
    print("--- 🚀 Loading ML models into memory... ---")
    try:
        models["preprocessor"] = joblib.load(PREPROCESSOR_PATH)
        print(f"✅ Loaded preprocessor")
        
        models["classifier"] = joblib.load(CLASSIFIER_PATH)
        print(f"✅ Loaded classifier (Random Forest)")
        
        models["regressor"] = joblib.load(REGRESSOR_PATH)
        print(f"✅ Loaded regressor (Linear)")
        
        models["clusterer"] = joblib.load(CLUSTER_PATH)
        print(f"✅ Loaded clusterer (K-Means)")
        
        print("--- ✨ All models loaded successfully! ---")
        
    except FileNotFoundError as e:
        print(f"❌ MODEL LOADING ERROR: File not found. {e}")
        print("Please make sure your models are in the 'backend/models/' folder.")
    except Exception as e:
        print(f"❌ An unknown error occurred during model loading: {e}")


# --- 4. HELPER FUNCTIONS ---

def get_model(name: str) -> Any:
    """
    A simple helper to safely get a loaded model from the cache.
    """
    model = models.get(name)
    if model is None:
        print(f"Error: Model '{name}' is not loaded.")
        raise RuntimeError(f"Model '{name}' is not loaded.")
    return model

def preprocess_input(input_data: CustomerInput) -> pd.DataFrame:
    """
    Takes raw CustomerInput data from the API, converts it to a DataFrame,
    and transforms it using the loaded 'preprocessor'.
    """
    preprocessor = get_model("preprocessor")
        
    input_df = pd.DataFrame([input_data.dict()])
    processed_data = preprocessor.transform(input_df)
    
    try:
        feature_names = preprocessor.get_feature_names_out()
    except Exception:
        print("Warning: Could not get feature names from preprocessor.")
        return processed_data

    processed_df = pd.DataFrame(processed_data, columns=feature_names)
    
    return processed_df