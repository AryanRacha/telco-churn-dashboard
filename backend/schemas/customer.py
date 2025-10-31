from pydantic import BaseModel

# --- Pydantic Model for API Input ---
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
    tenure: float 
    MonthlyCharges: float
    TotalCharges: float

# --- Pydantic Models for API Output ---
class ClassificationOutput(BaseModel):
    prediction: int
    probability: float

class FeatureImportance(BaseModel):
    feature: str
    importance: float

class RiskProfileResponse(BaseModel):
    classification: ClassificationOutput
    top_risk_factors: list[FeatureImportance]

class RegressionOutput(BaseModel):
    predicted_monthly_charge: float
    actual_monthly_charge: float  

class ClusterOutput(BaseModel):
    cluster: int
    tenure: float             
    monthly_charge: float     