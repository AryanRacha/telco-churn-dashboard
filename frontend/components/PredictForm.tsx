"use client";

import { useState } from "react";
import { CustomerInput, RiskProfileResponse } from "@/lib/types";
import { getRiskProfile } from "@/lib/api";
import RiskProfileCard from "./RiskProfileCard";

export default function PredictionForm() {
  // --- State for Form Data ---
  const [formData, setFormData] = useState<CustomerInput>({
    // Initialize with defaults matching your backend schema
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
    tenure: 1,
    MonthlyCharges: 70.0,
    TotalCharges: 70.0,
  });

  // --- State for API Interaction ---
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<RiskProfileResponse | null>(null);

  // --- Handle Input Changes ---
  const handleChange = (
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

    setFormData((prev) => ({
      ...prev,
      [name]: processedValue,
    }));
  };

  // --- Handle Form Submission ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setResults(null);

    try {
      if (
        formData.TotalCharges <
        formData.MonthlyCharges * (formData.tenure || 1) * 0.8
      ) {
        console.warn(
          "TotalCharges seems low for the given tenure and MonthlyCharges."
        );
      }
      const response = await getRiskProfile(formData);
      setResults(response);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred."
      );
      console.error("API Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Use grid layout for large screens to separate form and results
    <div className="lg:grid lg:grid-cols-2">
      {/* --- The Form (Left Column on Large Screens) --- */}
      <form
        onSubmit={handleSubmit}
        className="lg:col-span-5 p-6 rounded-lg shadow-lg bg-white lg:top-8 self-start mb-10"
      >
        {" "}
        {/* Added self-start */}
        <h2 className="text-2xl font-bold mb-6">Customer Data Input</h2>
        {/* Form Fields Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* --- Customer Demographics --- */}
          <div>
            <label
              htmlFor="gender"
              className="block text-sm font-medium text-gray-700"
            >
              Gender
            </label>
            <select
              name="gender"
              id="gender"
              value={formData.gender}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
            >
              <option>Female</option>
              <option>Male</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="SeniorCitizen"
              className="block text-sm font-medium text-gray-700"
            >
              Senior Citizen?
            </label>
            <select
              name="SeniorCitizen"
              id="SeniorCitizen"
              value={formData.SeniorCitizen}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
            >
              <option value={0}>No</option>
              <option value={1}>Yes</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="Partner"
              className="block text-sm font-medium text-gray-700"
            >
              Partner?
            </label>
            <select
              name="Partner"
              id="Partner"
              value={formData.Partner}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
            >
              <option>Yes</option>
              <option>No</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="Dependents"
              className="block text-sm font-medium text-gray-700"
            >
              Dependents?
            </label>
            <select
              name="Dependents"
              id="Dependents"
              value={formData.Dependents}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
            >
              <option>No</option>
              <option>Yes</option>
            </select>
          </div>

          {/* --- Account Information --- */}
          <div>
            <label
              htmlFor="tenure"
              className="block text-sm font-medium text-gray-700"
            >
              Tenure (Months)
            </label>
            <input
              type="number"
              name="tenure"
              id="tenure"
              value={formData.tenure}
              onChange={handleChange}
              min="0"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
            />
          </div>
          <div>
            <label
              htmlFor="Contract"
              className="block text-sm font-medium text-gray-700"
            >
              Contract
            </label>
            <select
              name="Contract"
              id="Contract"
              value={formData.Contract}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
            >
              <option>Month-to-month</option>
              <option>One year</option>
              <option>Two year</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="PaperlessBilling"
              className="block text-sm font-medium text-gray-700"
            >
              Paperless Billing?
            </label>
            <select
              name="PaperlessBilling"
              id="PaperlessBilling"
              value={formData.PaperlessBilling}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
            >
              <option>Yes</option>
              <option>No</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="PaymentMethod"
              className="block text-sm font-medium text-gray-700"
            >
              Payment Method
            </label>
            <select
              name="PaymentMethod"
              id="PaymentMethod"
              value={formData.PaymentMethod}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
            >
              <option>Electronic check</option>
              <option>Mailed check</option>
              <option>Bank transfer (automatic)</option>
              <option>Credit card (automatic)</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="MonthlyCharges"
              className="block text-sm font-medium text-gray-700"
            >
              Monthly Charges ($)
            </label>
            <input
              type="number"
              name="MonthlyCharges"
              id="MonthlyCharges"
              step="0.01"
              value={formData.MonthlyCharges}
              onChange={handleChange}
              min="0"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
            />
          </div>
          <div>
            <label
              htmlFor="TotalCharges"
              className="block text-sm font-medium text-gray-700"
            >
              Total Charges ($)
            </label>
            <input
              type="number"
              name="TotalCharges"
              id="TotalCharges"
              step="0.01"
              value={formData.TotalCharges}
              onChange={handleChange}
              min="0"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
            />
          </div>

          {/* --- Services Subscribed --- */}
          <div>
            <label
              htmlFor="PhoneService"
              className="block text-sm font-medium text-gray-700"
            >
              Phone Service?
            </label>
            <select
              name="PhoneService"
              id="PhoneService"
              value={formData.PhoneService}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
            >
              <option>Yes</option>
              <option>No</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="MultipleLines"
              className="block text-sm font-medium text-gray-700"
            >
              Multiple Lines?
            </label>
            <select
              name="MultipleLines"
              id="MultipleLines"
              value={formData.MultipleLines}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
            >
              <option>No phone service</option>
              <option>No</option>
              <option>Yes</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="InternetService"
              className="block text-sm font-medium text-gray-700"
            >
              Internet Service
            </label>
            <select
              name="InternetService"
              id="InternetService"
              value={formData.InternetService}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
            >
              <option>DSL</option>
              <option>Fiber optic</option>
              <option>No</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="OnlineSecurity"
              className="block text-sm font-medium text-gray-700"
            >
              Online Security?
            </label>
            <select
              name="OnlineSecurity"
              id="OnlineSecurity"
              value={formData.OnlineSecurity}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
            >
              <option>No internet service</option>
              <option>No</option>
              <option>Yes</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="OnlineBackup"
              className="block text-sm font-medium text-gray-700"
            >
              Online Backup?
            </label>
            <select
              name="OnlineBackup"
              id="OnlineBackup"
              value={formData.OnlineBackup}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
            >
              <option>No internet service</option>
              <option>No</option>
              <option>Yes</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="DeviceProtection"
              className="block text-sm font-medium text-gray-700"
            >
              Device Protection?
            </label>
            <select
              name="DeviceProtection"
              id="DeviceProtection"
              value={formData.DeviceProtection}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
            >
              <option>No internet service</option>
              <option>No</option>
              <option>Yes</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="TechSupport"
              className="block text-sm font-medium text-gray-700"
            >
              Tech Support?
            </label>
            <select
              name="TechSupport"
              id="TechSupport"
              value={formData.TechSupport}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
            >
              <option>No internet service</option>
              <option>No</option>
              <option>Yes</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="StreamingTV"
              className="block text-sm font-medium text-gray-700"
            >
              Streaming TV?
            </label>
            <select
              name="StreamingTV"
              id="StreamingTV"
              value={formData.StreamingTV}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
            >
              <option>No internet service</option>
              <option>No</option>
              <option>Yes</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="StreamingMovies"
              className="block text-sm font-medium text-gray-700"
            >
              Streaming Movies?
            </label>
            <select
              name="StreamingMovies"
              id="StreamingMovies"
              value={formData.StreamingMovies}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
            >
              <option>No internet service</option>
              <option>No</option>
              <option>Yes</option>
            </select>
          </div>
        </div>{" "}
        {/* End Grid */}
        {/* --- Submit Button --- */}
        {/* Make sure this is INSIDE the <form> element */}
        <div className="mt-6">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? "Analyzing..." : "Analyze Risk Profile"}
          </button>
        </div>
      </form>

      {/* --- Display Area (Right Column on Large Screens) --- */}
      <div className="lg:col-span-7 mt-8 lg:mt-0">
        {" "}
        {/* This div will hold the results */}
        {error && (
          <div className="p-4 text-red-700 bg-red-100 rounded-md">
            <strong>Error:</strong> {error}
          </div>
        )}
        {isLoading && (
          <div className="p-4 text-blue-700 bg-blue-100 rounded-md animate-pulse">
            Loading results...
          </div>
        )}
        {results && !isLoading && !error && (
          // Render the RiskProfileCard component when results are available
          <RiskProfileCard data={results} />
        )}
        {/* Initial placeholder */}
        {!results && !isLoading && !error && (
          <div className="p-6 text-center text-gray-500 bg-white rounded-lg shadow-lg lg:top-8">
            Enter customer data and click "Analyze" to see the risk profile.
          </div>
        )}
      </div>
    </div> // End Main Grid
  );
}
