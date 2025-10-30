"use client"; // This page is interactive, so it's a Client Component

import { useState, useEffect } from "react";
import Image from "next/image";
import { getClusteringData, getRegressionData } from "@/lib/api";
import { ClusterDataPoint, RegressionDataPoint } from "@/lib/types";

import ClusterScatterPlot from "@/components/ClusterScatterPlot";
import RegressionScatterPlot from "@/components/RegressionScatterPlot";

export default function FiguresPage() {
  // --- State Hooks ---
  const [clusterData, setClusterData] = useState<ClusterDataPoint[]>([]);
  const [regressionData, setRegressionData] = useState<RegressionDataPoint[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- Data Fetching Effect ---
  // This runs once when the component mounts
  useEffect(() => {
    async function fetchData() {
      try {
        // We use Promise.all to fetch both datasets at the same time
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
  }, []); // The empty array [] means "run this only once"

  // --- Loading and Error Handling ---
  if (isLoading) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold">Loading Model Figures...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold text-red-600">Error</h1>
        <p>{error}</p>
      </div>
    );
  }

  // --- Main Page Render ---
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-4">📊 Model Figures</h1>
      <p className="text-lg text-gray-600 mb-8">
        Visual insights from our Clustering and Regression models.
      </p>

      {/* --- Charts Area --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* K-Means Clustering Chart */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">
            K-Means Customer Segments (Tenure vs. Monthly Charges)
          </h3>
          <p className="text-sm text-gray-500 mb-2">
            This shows the 3 natural customer groups found by our K-Means model.
          </p>
          <div className="h-80 bg-gray-100 flex items-center justify-center">
            <ClusterScatterPlot data={clusterData} />
          </div>
        </div>

        {/* Linear Regression Chart */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">
            Regression: Actual vs. Predicted Monthly Charges
          </h3>
          <p className="text-sm text-gray-500 mb-2">
            This shows how accurately our Linear Regression model can predict a
            customer's bill.
          </p>
          <div className="h-80 bg-gray-100 flex items-center justify-center">
            <RegressionScatterPlot data={regressionData} />
          </div>
        </div>

        {/* We can also add the static plots from our /reports/visuals folder */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">
            Classifier: Top 10 Feature Importances
          </h3>
          <p className="text-sm text-gray-500 mb-2">
            This plot from our Random Forest model shows which factors have the
            biggest impact on churn.
          </p>
          <div className="relative w-full h-80">
            <Image
              src="/feature_importance.png"
              alt="Feature Importance Chart"
              fill // Use 'fill' prop
              style={{ objectFit: "contain" }} // Use 'style' prop for objectFit
            />
          </div>
        </div>
      </div>
    </div>
  );
}
