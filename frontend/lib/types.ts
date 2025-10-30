/**
 * This type defines the shape of a single customer
 * coming from your /api/explorer endpoint.
 */
export interface Customer {
  gender: string;
  SeniorCitizen: number;
  Partner: string;
  Dependents: string;
  PhoneService: string;
  MultipleLines: string;
  InternetService: string;
  OnlineSecurity: string;
  OnlineBackup: string;
  DeviceProtection: string;
  TechSupport: string;
  StreamingTV: string;
  StreamingMovies: string;
  Contract: string;
  PaperlessBilling: string;
  PaymentMethod: string;
  tenure: number;
  MonthlyCharges: number;
  TotalCharges: number;
  Churn: string;
}

/**
 * --- THIS IS THE FIX ---
 * Add the 'export' keyword here.
 */
export interface CustomerInput {
  gender: string;
  SeniorCitizen: number;
  Partner: string;
  Dependents: string;
  PhoneService: string;
  MultipleLines: string;
  InternetService: string;
  OnlineSecurity: string;
  OnlineBackup: string;
  DeviceProtection: string;
  TechSupport: string;
  StreamingTV: string;
  StreamingMovies: string;
  Contract: string;
  PaperlessBilling: string;
  PaymentMethod: string;
  tenure: number;
  MonthlyCharges: number;
  TotalCharges: number;
}

/**
 * This type defines the shape of the data
 * coming from your /api/predict endpoint.
 */
export interface RiskProfileResponse {
  classification: {
    prediction: 0 | 1;
    probability: number;
  };
  top_risk_factors: {
    feature: string;
    importance: number;
  }[];
}

/**
 * This type defines the shape of the data
 * coming from your /api/figures/regression endpoint.
 */
export interface RegressionDataPoint {
  predicted_monthly_charge: number;
  actual_monthly_charge: number;
}

/**
 * This type defines the shape of the data
 * coming from your /api/figures/clustering endpoint.
 */
export interface ClusterDataPoint {
  tenure: number;
  monthly_charge: number;
  cluster: number;
}
