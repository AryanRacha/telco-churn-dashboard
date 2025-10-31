"use client"; // This page fetches data and uses charts

import { useState, useEffect } from "react";
import Image from "next/image";
import dynamic from "next/dynamic"; // We need this for client-side charts
import { getClusteringData, getRegressionData } from "@/lib/api";
import { ClusterDataPoint, RegressionDataPoint } from "@/lib/types";

// --- 1. Define the base URL for your backend images ---
const IMAGE_API_URL = "http://127.0.0.1:8000/api/images";

// --- 2. Dynamically Import Recharts Components ---
// This tells Next.js to only render these on the client, fixing the "empty chart" bug.
const ClusterScatterPlot = dynamic(
  () => import("@/components/ClusterScatterPlot"),
  {
    ssr: false, // No Server-Side Rendering
    loading: () => (
      <div className="h-full w-full flex items-center justify-center">
        Loading Chart...
      </div>
    ),
  }
);

const RegressionScatterPlot = dynamic(
  () => import("@/components/RegressionScatterPlot"),
  {
    ssr: false,
    loading: () => (
      <div className="h-full w-full flex items-center justify-center">
        Loading Chart...
      </div>
    ),
  }
);

// --- Reusable component for your static .png charts ---
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
    <div className="relative w-full h-80 border rounded-md">
      <Image
        src={`${IMAGE_API_URL}/${imgSrc}`}
        alt={title}
        fill
        style={{ objectFit: "contain", padding: "10px" }}
        unoptimized={true} // Fixes the 400 Bad Request error
      />
    </div>
  </div>
);

// --- Main Page Component ---
export default function InsightsPage() {
  // State for our live charts
  const [clusterData, setClusterData] = useState<ClusterDataPoint[]>([]);
  const [regressionData, setRegressionData] = useState<RegressionDataPoint[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data for the live charts on page load
  useEffect(() => {
    async function fetchData() {
      try {
        const [clusterResult, regressionResult] = await Promise.all([
          getClusteringData(),
          getRegressionData(),
        ]);

        setClusterData(clusterResult);
        setRegressionData(regressionResult);
      } catch (err) {
        setError("Failed to fetch model figure data.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <main className="p-10">
      <h1 className="text-4xl font-bold mb-4">💡 Model Insights</h1>
      <p className="text-lg text-gray-600 mb-8">
        This is the "report" showing the results of our three ML models.
      </p>

      {/* --- Main 2x2 Grid --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* --- 1. K-Means (Live) --- */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-3">
            K-Means Customer Segments
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            Live plot showing 3 distinct customer segments found by our model.
          </p>
          <div className="h-96">
            {isLoading && <p>Loading chart...</p>}
            {error && <p className="text-red-500">Could not load chart.</p>}
            {!isLoading && !error && <ClusterScatterPlot data={clusterData} />}
          </div>
        </div>

        {/* --- 2. Regression (Live) --- */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-3">
            Regression: Actual vs. Predicted
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            Live plot showing how well our model predicts `MonthlyCharges`. (Red
            line = perfect).
          </p>
          <div className="h-96">
            {isLoading && <p>Loading chart...</p>}
            {error && <p className="text-red-500">Could not load chart.</p>}
            {!isLoading && !error && (
              <RegressionScatterPlot data={regressionData} />
            )}
          </div>
        </div>

        {/* --- 3. Feature Importance (Static) --- */}
        <StaticChartCard
          title="Classifier: Feature Importance"
          description="The top 10 features our Random Forest model uses to predict churn."
          imgSrc="feature_importance.png"
        />

        {/* --- 4. Confusion Matrix (Static) --- */}
        <StaticChartCard
          title="Classifier: Confusion Matrix"
          description="The official 'report card' for our classifier on the test data."
          imgSrc="confusion_matrix.png"
        />
      </div>
    </main>
  );
}
