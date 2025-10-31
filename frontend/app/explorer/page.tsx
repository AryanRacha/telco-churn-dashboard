"use client";

import { useState, useEffect } from "react";
import { Customer } from "@/lib/types";
import { getExplorerData } from "@/lib/api";
import Image from "next/image";
import DynamicParameterChart from "@/components/DynamicParameterChart";

const IMAGE_API_URL = "http://127.0.0.1:8000/api/images";

const categoricalParameters = [
  { value: "Contract", label: "Contract Type" },
  { value: "InternetService", label: "Internet Service" },
  { value: "PaymentMethod", label: "Payment Method" },
  { value: "TechSupport", label: "Tech Support" },
  { value: "OnlineSecurity", label: "Online Security" },
  { value: "DeviceProtection", label: "Device Protection" },
  { value: "OnlineBackup", label: "Online Backup" },
  { value: "StreamingTV", label: "Streaming TV" },
  { value: "StreamingMovies", label: "Streaming Movies" },
  { value: "SeniorCitizen", label: "Senior Citizen" },
  { value: "Partner", label: "Partner" },
  { value: "Dependents", label: "Dependents" },
  { value: "PhoneService", label: "Phone Service" },
  { value: "MultipleLines", label: "Multiple Lines" },
  { value: "gender", label: "Gender" },
  { value: "PaperlessBilling", label: "Paperless Billing" },
];

// --- A simple component to display static charts ---
const StaticChartCard = ({
  title,
  description,
  imgSrc,
}: {
  title: string;
  description: string;
  imgSrc: string;
}) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <h3 className="text-xl font-semibold mb-3">{title}</h3>
    <p className="text-sm text-gray-500 mb-4">{description}</p>
    <div className="relative w-full h-80">
      <Image
        src={`${IMAGE_API_URL}/${imgSrc}`}
        alt={title}
        fill
        style={{ objectFit: "contain" }}
        unoptimized={true} // <--- THIS IS THE FIX
      />
    </div>
  </div>
);

export default function ExplorerPage() {
  const [allData, setAllData] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedParameter, setSelectedParameter] = useState(
    categoricalParameters[0].value
  );

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getExplorerData();
        setAllData(data);
      } catch (err) {
        setError("Failed to fetch explorer data.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="p-10 flex justify-center items-center h-screen">
        <h1 className="text-2xl font-semibold text-gray-700">
          Loading explorer data...
        </h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-10">
        <h1 className="text-3xl font-bold text-red-600">Error</h1>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <main className="p-10">
      <h1 className="text-4xl font-bold mb-4">📊 Dataset Explorer</h1>
      <p className="text-lg text-gray-600 mb-8">
        This is your interactive dashboard for Exploratory Data Analysis (EDA).
      </p>

      {/* --- 1. DYNAMIC PARAMETER EXPLORER --- */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-semibold mb-4">
          Categorical Feature Explorer
        </h2>
        <p className="text-gray-600 mb-4">
          Select a parameter to see the distribution of Churn (Yes) vs. Stayed
          (No).
        </p>

        <div className="mb-4 max-w-xs">
          <label
            htmlFor="param-select"
            className="block text-sm font-medium text-gray-700"
          >
            Select a Parameter
          </label>
          <select
            id="param-select"
            value={selectedParameter}
            onChange={(e) => setSelectedParameter(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            {categoricalParameters.map((param) => (
              <option key={param.value} value={param.value}>
                {param.label}
              </option>
            ))}
          </select>
        </div>

        <div className="h-96">
          <DynamicParameterChart
            data={allData}
            parameter={selectedParameter as keyof Customer}
          />
        </div>
      </div>

      {/* --- 2. NUMERICAL & DATA ANALYSIS (STATIC GRID) --- */}
      <h2 className="text-2xl font-semibold mb-4 text-gray-700">
        Numerical & Correlation Analysis
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <StaticChartCard
          title="Tenure vs. Churn"
          description="Customers who churn (1) have a significantly lower tenure (lifespan)."
          imgSrc="tenure_vs_churn.svg"
        />

        <StaticChartCard
          title="Monthly Charges vs. Churn"
          description="Customers who churn (1) tend to have higher monthly charges."
          imgSrc="monthlycharges_vs_churn.svg"
        />

        <StaticChartCard
          title="Total Charges vs. Churn"
          description="Customers who churn (1) have a lower overall total spend (as they are newer)."
          imgSrc="totalcharges_vs_churn.svg"
        />

        <StaticChartCard
          title="Correlation Heatmap"
          description="Shows how numerical features relate to each other."
          imgSrc="correlation_heatmap.svg"
        />
      </div>
    </main>
  );
}
