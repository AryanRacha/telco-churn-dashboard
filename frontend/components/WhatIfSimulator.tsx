"use client";

import { useState, useEffect, useCallback } from "react";
import { CustomerInput, RiskProfileResponse } from "@/lib/types";
import { getRiskProfile } from "@/lib/api";
import debounce from "lodash.debounce";

// Simple Gauge component
const GaugeChart = ({ probability }: { probability: number }) => {
  const percentage = (probability * 100).toFixed(0);
  const isHighRisk = probability > 0.5;
  const color = isHighRisk ? "text-red-500" : "text-green-500";
  const label = isHighRisk ? "Likely to Churn" : "Likely to Stay";

  return (
    <div className="text-center p-4 rounded-lg bg-white shadow-inner">
      {" "}
      {/* Added inner shadow */}
      <div className={`text-6xl font-extrabold ${color}`}>{percentage}%</div>
      <div className={`text-xl font-semibold mt-2 ${color}`}>
        Risk Score ({label})
      </div>
    </div>
  );
};

export default function WhatIfSimulator() {
  // --- State ---
  const [customerData, setCustomerData] = useState<CustomerInput | null>(null);
  const [currentRisk, setCurrentRisk] = useState<RiskProfileResponse | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false); // Changed initial state to false
  const [error, setError] = useState<string | null>(null);

  // --- Initial Customer Data (Example) ---
  const initialCustomer: CustomerInput = {
    gender: "Female",
    SeniorCitizen: 0,
    Partner: "Yes",
    Dependents: "No",
    PhoneService: "Yes",
    MultipleLines: "No",
    InternetService: "Fiber optic",
    OnlineSecurity: "No",
    OnlineBackup: "No",
    DeviceProtection: "No",
    TechSupport: "No",
    StreamingTV: "No",
    StreamingMovies: "No",
    Contract: "Month-to-month",
    PaperlessBilling: "Yes",
    PaymentMethod: "Electronic check",
    tenure: 5,
    MonthlyCharges: 75.5,
    TotalCharges: 377.5, // Example values
  };

  // --- API Call Function (Debounced) ---
  const fetchPrediction = useCallback(
    debounce(async (data: CustomerInput | null) => {
      // Allow null input
      if (!data) return; // Don't run if data is null
      // Don't show loading immediately for quick slider changes
      // setIsLoading(true);
      setError(null);
      try {
        const response = await getRiskProfile(data);
        setCurrentRisk(response);
      } catch (err) {
        setError(err instanceof Error ? err.message : "API Error");
        console.error("API Error:", err);
        setCurrentRisk(null); // Clear previous risk on error
      } finally {
        // setIsLoading(false); // Only set loading false if needed
      }
    }, 300), // Shortened debounce to 300ms for responsiveness
    []
  );

  // --- Effect to Load Initial Data & Prediction ---
  useEffect(() => {
    setCustomerData(initialCustomer);
    // Fetch initial prediction without delay
    const fetchInitial = async () => {
      setIsLoading(true); // Show loading for the first fetch
      try {
        const response = await getRiskProfile(initialCustomer);
        setCurrentRisk(response);
      } catch (err) {
        setError(err instanceof Error ? err.message : "API Error");
        console.error("Initial API Error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchInitial();
    // No dependency on fetchPrediction here to avoid re-running debounced func
  }, []); // Run only once

  // --- Handle Slider/Dropdown Changes ---
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    let processedValue: string | number = value;

    if (
      ["tenure", "MonthlyCharges", "TotalCharges", "SeniorCitizen"].includes(
        name
      )
    ) {
      processedValue = parseFloat(value);
      if (processedValue < 0 && name !== "SeniorCitizen") processedValue = 0;
    }

    // Update the customer data state if it exists
    setCustomerData((prevData) => {
      if (!prevData) return null; // Should not happen after initial load
      const updatedData = { ...prevData, [name]: processedValue };
      // Trigger a new prediction (debounced)
      fetchPrediction(updatedData as CustomerInput); // Type assertion
      return updatedData as CustomerInput;
    });
  };

  // --- Render ---
  if (customerData === null && isLoading) {
    return (
      <div className="p-8 text-center">Loading initial customer data...</div>
    );
  }
  if (customerData === null && error) {
    return (
      <div className="p-8 text-center text-red-600">
        Error loading initial data: {error}
      </div>
    );
  }
  if (!customerData) {
    // Fallback if initial load failed without error state somehow
    return <div className="p-8 text-center">Could not load customer data.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Column 1: Base Profile (Read Only) */}
      <div className="md:col-span-1 p-6 rounded-lg shadow-lg bg-white">
        <h2 className="text-xl font-bold mb-4 border-b pb-2 text-gray-700">
          Base Profile (Read Only)
        </h2>
        <div className="space-y-2 text-sm text-gray-600">
          <p>
            <strong>Tenure:</strong> {initialCustomer.tenure} mos
          </p>
          <p>
            <strong>Monthly Charge:</strong> $
            {initialCustomer.MonthlyCharges.toFixed(2)}
          </p>
          <p>
            <strong>Contract:</strong> {initialCustomer.Contract}
          </p>
          <p>
            <strong>Internet:</strong> {initialCustomer.InternetService}
          </p>
          <p>
            <strong>Senior Citizen:</strong>{" "}
            {initialCustomer.SeniorCitizen === 1 ? "Yes" : "No"}
          </p>
          {/* Display more fields if desired */}
        </div>
      </div>

      {/* Column 2: Simulators (Interactive Controls) */}
      <div className="md:col-span-1 p-6 rounded-lg shadow-lg bg-white">
        <h2 className="text-xl font-bold mb-4 border-b pb-2 text-gray-700">
          Risk Simulators
        </h2>
        <div className="space-y-6">
          {" "}
          {/* Increased spacing */}
          {/* Slider 1: Tenure */}
          <div>
            <label
              htmlFor="sim-tenure"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Adjust Tenure:{" "}
              <span className="font-semibold">
                {customerData.tenure} months
              </span>
            </label>
            <input
              type="range"
              id="sim-tenure"
              name="tenure"
              min="0"
              max="72"
              value={customerData.tenure}
              onChange={handleInputChange}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>
          {/* Slider 2: Monthly Charges */}
          <div>
            <label
              htmlFor="sim-monthly"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Adjust Monthly Charges:{" "}
              <span className="font-semibold">
                ${customerData.MonthlyCharges.toFixed(2)}
              </span>
            </label>
            <input
              type="range"
              id="sim-monthly"
              name="MonthlyCharges"
              min="18"
              max="120"
              step="0.1"
              value={customerData.MonthlyCharges}
              onChange={handleInputChange}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>
          {/* Dropdown 1: Contract */}
          <div>
            <label
              htmlFor="sim-contract"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Change Contract Type
            </label>
            <select
              id="sim-contract"
              name="Contract"
              value={customerData.Contract}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 text-sm"
            >
              <option>Month-to-month</option>
              <option>One year</option>
              <option>Two year</option>
            </select>
          </div>
          {/* Dropdown 2: Senior Citizen */}
          <div>
            <label
              htmlFor="sim-senior"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Change Senior Citizen Status
            </label>
            <select
              id="sim-senior"
              name="SeniorCitizen"
              value={customerData.SeniorCitizen}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 text-sm"
            >
              <option value={0}>No</option>
              <option value={1}>Yes</option>
            </select>
          </div>
        </div>
      </div>

      {/* Column 3: Simulated Risk Score (Live Update) */}
      <div className="md:col-span-1 p-6 rounded-lg shadow-lg bg-linear-to-br from-blue-50 to-indigo-100">
        <h2 className="text-xl font-bold mb-4 border-b border-blue-200 pb-2 text-gray-700">
          Simulated Risk Score
        </h2>
        {/* Show loading indicator specific to this panel */}
        {isLoading && (
          <p className="text-blue-600 text-center animate-pulse">
            Calculating...
          </p>
        )}
        {error && <p className="text-red-600 text-center">Error: {error}</p>}
        {currentRisk && !isLoading && !error && (
          <GaugeChart probability={currentRisk.classification.probability} />
        )}
        {/* Show placeholder if no risk score yet (e.g., during initial load delay) */}
        {!currentRisk && !isLoading && !error && (
          <p className="text-gray-500 text-center">
            Adjust parameters to see risk score.
          </p>
        )}
      </div>
    </div>
  );
}
