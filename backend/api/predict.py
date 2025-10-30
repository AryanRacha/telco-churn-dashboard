from fastapi import APIRouter, HTTPException
import pandas as pd

# Import our helper functions and Pydantic models
from services.model_service import (
    get_model,
    preprocess_input
)
from schemas.customer import (
    CustomerInput,
    RiskProfileResponse,
    ClassificationOutput,
    FeatureImportance
)

router = APIRouter()

@router.post("/", response_model=RiskProfileResponse)
async def predict_churn(input_data: CustomerInput):
    """
    Receives customer data and returns a full risk profile.
    """
    
    try:
        # 1. Get models from cache
        classifier = get_model("classifier")
        preprocessor = get_model("preprocessor")

        # 2. Preprocess the raw input data
        processed_df = preprocess_input(input_data)
        
        # 3. Make Prediction
        prediction_proba = classifier.predict_proba(processed_df)
        churn_probability = prediction_proba[0][1] # Probability of class 1 (Churn)
        churn_prediction = 1 if churn_probability > 0.5 else 0

        # 4. Get Feature Importances (The "Why")
        feature_names = preprocessor.get_feature_names_out()
        importances = classifier.feature_importances_
        
        importance_df = pd.DataFrame({
            'feature': feature_names,
            'importance': importances
        }).sort_values(by='importance', ascending=False)
        
        top_3_features = importance_df.head(3)

        top_risk_factors = [
            FeatureImportance(
                feature=row['feature'], 
                importance=row['importance']
            ) 
            for _, row in top_3_features.iterrows()
        ]

        # 5. Return the final JSON object
        return RiskProfileResponse(
            classification=ClassificationOutput(
                prediction=churn_prediction,
                probability=churn_probability
            ),
            top_risk_factors=top_risk_factors
        )

    except RuntimeError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        print(f"Error during prediction: {e}")
        raise HTTPException(status_code=500, detail="An unexpected error occurred.")