from pydantic import BaseModel

# --- Pydantic Model for API Input ---
# This defines the data structure for a single customer
# Your frontend form MUST send a JSON object that matches this
class CustomerInput(BaseModel):
    gender: str
    SeniorCitizen: int
    Partner: str
    Dependents: str
    PhoneService: str
    MultipleLines: str
    InternetService: str
    OnlineSecurity: str
    OnlineBackup: str
    DeviceProtection: str
    TechSupport: str
    StreamingTV: str
    StreamingMovies: str
    Contract: str
    PaperlessBilling: str
    PaymentMethod: str
    
    # Use float for numbers to avoid type errors
    tenure: float 
    MonthlyCharges: float
    TotalCharges: float

# --- Pydantic Models for API Output ---
# We can also define our response shapes here
# This makes our API "self-documenting"

class ClassificationOutput(BaseModel):
    prediction: int  # 0 or 1
    probability: float # e.g., 0.82

class FeatureImportance(BaseModel):
    feature: str
    importance: float

class RiskProfileResponse(BaseModel):
    classification: ClassificationOutput
    top_risk_factors: list[FeatureImportance]

class RegressionOutput(BaseModel):
    predicted_monthly_charge: float

class ClusterOutput(BaseModel):
    cluster: int # e.g., 0, 1, or 2