import axios from "axios";
import {
  Customer,
  RiskProfileResponse,
  RegressionDataPoint,
  ClusterDataPoint,
} from "./types";

// Define the base URL for your FastAPI backend
const apiClient = axios.create({
  baseURL: "http://127.0.0.1:8000/api", // Your backend's address
});

/**
 * Fetches the entire cleaned dataset for the Explorer page.
 */
export const getExplorerData = async (): Promise<Customer[]> => {
  const response = await apiClient.get("/explorer");
  return response.data;
};

/**
 * Fetches the K-Means clustering results.
 */
export const getClusteringData = async (): Promise<ClusterDataPoint[]> => {
  const response = await apiClient.get("/figures/clustering");
  return response.data;
};

/**
 * Fetches the Linear Regression results.
 */
export const getRegressionData = async (): Promise<RegressionDataPoint[]> => {
  const response = await apiClient.get("/figures/regression");
  return response.data;
};

/**
 * Posts customer data and gets a churn risk profile.
 * 'CustomerInput' is the data shape your backend's Pydantic model expects.
 */
export const getRiskProfile = async (
  customerData: any
): Promise<RiskProfileResponse> => {
  const response = await apiClient.post("/predict", customerData);
  return response.data;
};
