"use client";

import { useState, useEffect, useCallback } from "react";
import { CustomerInput, RiskProfileResponse } from "@/lib/types";
import { getRiskProfile } from "@/lib/api";
import RiskProfileCard from "./RiskProfileCard";
import debounce from "lodash.debounce";

// --- Import our new components ---
import Toggle from "./Toggle";
import SegmentedControl from "./SegmentedControl";

// --- Define options for segmented controls ---
const genderOptions = [
  { name: "Female", value: "Female" },
  { name: "Male", value: "Male" },
];
const contractOptions = [
  { name: "Month-to-Month", value: "Month-to-month" },
  { name: "1 Year", value: "One year" },
  { name: "2 Year", value: "Two year" },
];
const internetOptions = [
  { name: "DSL", value: "DSL" },
  { name: "Fiber", value: "Fiber optic" },
  { name: "None", value: "No" },
];
// This 3-option is used by many services
const serviceOptions = [
  { name: "Yes", value: "Yes" },
  { name: "No", value: "No" },
  { name: "No Service", value: "No internet service" },
];
const multipleLinesOptions = [
  { name: "Yes", value: "Yes" },
  { name: "No", value: "No" },
  { name: "No Service", value: "No phone service" },
];

export default function LivePlayground() {
  // --- State for Form Data (all 19 fields) ---
  const [formData, setFormData] = useState<CustomerInput>({
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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<RiskProfileResponse | null>(null);

  // --- API Call (Debounced) ---
  const fetchDebouncedPrediction = useCallback(
    debounce(async (data: CustomerInput) => {
      setError(null);
      try {
        const response = await getRiskProfile(data);
        setResults(response);
      } catch (err) {
        setError(err instanceof Error ? err.message : "API Error");
      }
    }, 300),
    []
  );

  // --- Initial Load ---
  useEffect(() => {
    async function fetchInitialData() {
      try {
        const response = await getRiskProfile(formData);
        setResults(response);
      } catch (err) {
        setError(err instanceof Error ? err.message : "API Error");
      } finally {
        setIsLoading(false);
      }
    }
    fetchInitialData();
  }, []);

  // --- NEW UNIFIED CHANGE HANDLER ---
  const handleFormChange = (
    name: keyof CustomerInput,
    value: string | number | boolean
  ) => {
    let processedValue = value;
    if (typeof value === "boolean") {
      if (name === "SeniorCitizen") {
        processedValue = value ? 1 : 0;
      } else {
        // This handles Partner, Dependents, PhoneService, PaperlessBilling
        processedValue = value ? "Yes" : "No";
      }
    }

    const newData = {
      ...formData,
      [name]: processedValue,
    } as CustomerInput;

    setFormData(newData);
    fetchDebouncedPrediction(newData);
  };

  // Specific handler for <input> sliders (they use e.target)
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFormChange(
      e.target.name as keyof CustomerInput,
      parseFloat(e.target.value)
    );
  };

  return (
    // --- Main 2-Column Layout ---
    <div className="lg:grid lg:grid-cols-12 lg:gap-8">
      {/* --- Left Column: The Form --- */}
      <div className="lg:col-span-7">
        <div className="p-6 rounded-lg shadow-lg bg-white space-y-8">
          {/* --- Section 1: Account Sliders --- */}
          <fieldset className="space-y-6">
            <legend className="text-xl font-semibold text-gray-800">
              Account Details
            </legend>
            {/* Tenure Slider */}
            <div>
              <label
                htmlFor="tenure"
                className="block text-sm font-medium text-gray-700"
              >
                Tenure:{" "}
                <span className="font-bold">{formData.tenure} months</span>
              </label>
              <input
                type="range"
                id="tenure"
                name="tenure"
                min="0"
                max="72"
                value={formData.tenure}
                onChange={handleSliderChange}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>
            {/* MonthlyCharges Slider */}
            <div>
              <label
                htmlFor="MonthlyCharges"
                className="block text-sm font-medium text-gray-700"
              >
                Monthly Charges:{" "}
                <span className="font-bold">
                  ${formData.MonthlyCharges.toFixed(2)}
                </span>
              </label>
              <input
                type="range"
                id="MonthlyCharges"
                name="MonthlyCharges"
                min="18"
                max="120"
                step="0.1"
                value={formData.MonthlyCharges}
                onChange={handleSliderChange}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>
            {/* TotalCharges Slider */}
            <div>
              <label
                htmlFor="TotalCharges"
                className="block text-sm font-medium text-gray-700"
              >
                Total Charges:{" "}
                <span className="font-bold">
                  ${formData.TotalCharges.toFixed(2)}
                </span>
              </label>
              <input
                type="range"
                id="TotalCharges"
                name="TotalCharges"
                min="0"
                max="9000"
                step="10"
                value={formData.TotalCharges}
                onChange={handleSliderChange}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>
          </fieldset>

          {/* --- Section 2: Customer Profile (Toggles) --- */}
          <fieldset className="space-y-4">
            <legend className="text-xl font-semibold text-gray-800">
              Customer Profile
            </legend>
            {/* Use SegmentedControl for Gender */}
            <SegmentedControl
              label="Gender"
              options={genderOptions}
              selected={formData.gender}
              onChange={(value) => handleFormChange("gender", value)}
            />
            {/* Use Toggles for all the Yes/No fields */}
            <div className="grid grid-cols-2 gap-4">
              <Toggle
                label="Senior Citizen"
                enabled={formData.SeniorCitizen === 1}
                onChange={(value) => handleFormChange("SeniorCitizen", value)}
              />
              <Toggle
                label="Partner"
                enabled={formData.Partner === "Yes"}
                onChange={(value) => handleFormChange("Partner", value)}
              />
              <Toggle
                label="Dependents"
                enabled={formData.Dependents === "Yes"}
                onChange={(value) => handleFormChange("Dependents", value)}
              />
              <Toggle
                label="Paperless Billing"
                enabled={formData.PaperlessBilling === "Yes"}
                onChange={(value) =>
                  handleFormChange("PaperlessBilling", value)
                }
              />
            </div>
          </fieldset>

          {/* --- Section 3: Services & Contract (Multi-option) --- */}
          <fieldset className="space-y-6">
            <legend className="text-xl font-semibold text-gray-800">
              Services & Contract
            </legend>
            {/* Use SegmentedControl for key options */}
            <SegmentedControl
              label="Contract"
              options={contractOptions}
              selected={formData.Contract}
              onChange={(value) => handleFormChange("Contract", value)}
            />
            <SegmentedControl
              label="Internet Service"
              options={internetOptions}
              selected={formData.InternetService}
              onChange={(value) => handleFormChange("InternetService", value)}
            />

            {/* Use Toggles for simple services */}
            <div className="grid grid-cols-2 gap-4">
              <Toggle
                label="Phone Service"
                enabled={formData.PhoneService === "Yes"}
                onChange={(value) => handleFormChange("PhoneService", value)}
              />
            </div>

            {/* Use Dropdowns for less critical or multi-option services */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="block">
                <span className="text-sm font-medium text-gray-700">
                  Multiple Lines
                </span>
                <select
                  name="MultipleLines"
                  value={formData.MultipleLines}
                  onChange={(e) =>
                    handleFormChange("MultipleLines", e.target.value)
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                >
                  <option>No phone service</option>
                  <option>No</option>
                  <option>Yes</option>
                </select>
              </label>
              <label className="block">
                <span className="text-sm font-medium text-gray-700">
                  Payment Method
                </span>
                <select
                  name="PaymentMethod"
                  value={formData.PaymentMethod}
                  onChange={(e) =>
                    handleFormChange("PaymentMethod", e.target.value)
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                >
                  <option>Electronic check</option>
                  <option>Mailed check</option>
                  <option>Bank transfer (automatic)</option>
                  <option>Credit card (automatic)</option>
                </select>
              </label>
            </div>

            {/* Sub-grid for Internet Add-ons */}
            <div className="space-y-4 rounded-md border border-gray-200 p-4">
              <h4 className="text-md font-semibold text-gray-600">
                Internet Add-ons
              </h4>
              <p className="text-xs text-gray-500">
                Note: These require an Internet Service (DSL or Fiber) to be
                active.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SegmentedControl
                  label="Online Security"
                  options={serviceOptions}
                  selected={formData.OnlineSecurity}
                  onChange={(v) => handleFormChange("OnlineSecurity", v)}
                />
                <SegmentedControl
                  label="Online Backup"
                  options={serviceOptions}
                  selected={formData.OnlineBackup}
                  onChange={(v) => handleFormChange("OnlineBackup", v)}
                />
                <SegmentedControl
                  label="Device Protection"
                  options={serviceOptions}
                  selected={formData.DeviceProtection}
                  onChange={(v) => handleFormChange("DeviceProtection", v)}
                />
                <SegmentedControl
                  label="Tech Support"
                  options={serviceOptions}
                  selected={formData.TechSupport}
                  onChange={(v) => handleFormChange("TechSupport", v)}
                />
                <SegmentedControl
                  label="Streaming TV"
                  options={serviceOptions}
                  selected={formData.StreamingTV}
                  onChange={(v) => handleFormChange("StreamingTV", v)}
                />
                <SegmentedControl
                  label="Streaming Movies"
                  options={serviceOptions}
                  selected={formData.StreamingMovies}
                  onChange={(v) => handleFormChange("StreamingMovies", v)}
                />
              </div>
            </div>
          </fieldset>
        </div>
      </div>

      {/* --- Right Column: The Results --- */}
      <div className="lg:col-span-5 lg:sticky lg:top-10 self-start mt-8 lg:mt-0">
        <h2 className="text-2xl font-bold mb-4">Live Prediction</h2>
        {isLoading && (
          <div className="p-4 text-center text-blue-700">Loading...</div>
        )}
        {error && (
          <div className="p-4 text-red-700 bg-red-100 rounded-md">
            <strong>Error:</strong> {error}
          </div>
        )}
        {results && !isLoading && <RiskProfileCard data={results} />}
      </div>
    </div>
  );
}
