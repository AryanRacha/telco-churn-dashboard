"use client"; // Needs to be a client component to fetch data

import { useState, useEffect, useMemo } from "react";
import { getExplorerData } from "@/lib/api"; // Reuse the explorer API call
import { Customer } from "@/lib/types";
import KpiCard from "@/components/KpiCard"; // Import the new component

export default function HomePage() {
  const [data, setData] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data on component mount
  useEffect(() => {
    async function fetchData() {
      try {
        const result = await getExplorerData();
        setData(result);
      } catch (err) {
        setError("Failed to fetch data.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  // Calculate KPIs using useMemo for efficiency
  const kpis = useMemo(() => {
    if (!data || data.length === 0) {
      return {
        totalCustomers: 0,
        churnRate: 0,
        avgTenure: 0,
        avgMonthlyCharge: 0,
      };
    }

    const totalCustomers = data.length;
    const churnedCustomers = data.filter((c) => c.Churn === "Yes").length;
    const churnRate = (churnedCustomers / totalCustomers) * 100;
    const totalTenure = data.reduce((sum, c) => sum + c.tenure, 0);
    const avgTenure = totalTenure / totalCustomers;
    const totalMonthlyCharge = data.reduce(
      (sum, c) => sum + c.MonthlyCharges,
      0
    );
    const avgMonthlyCharge = totalMonthlyCharge / totalCustomers;

    return {
      totalCustomers,
      churnRate: churnRate.toFixed(1) + "%", // Format as percentage string
      avgTenure: avgTenure.toFixed(0), // Format as whole number
      avgMonthlyCharge: "$" + avgMonthlyCharge.toFixed(2), // Format as currency string
    };
  }, [data]);

  return (
    <main className="p-8">
      {/* Hero Section */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold mb-2">
          🏠 Proactive Customer Churn Dashboard
        </h1>
        <p className="text-lg text-gray-600">
          Using Random Forest and FastAPI to find *why* customers leave and
          *how* to keep them.
        </p>
      </div>

      {/* KPI Section */}
      <div className="mb-10">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">
          Overall Metrics
        </h2>
        {isLoading && <p>Loading KPIs...</p>}
        {error && <p className="text-red-600">Error loading KPIs: {error}</p>}
        {!isLoading && !error && (
          <dl className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <KpiCard
              title="Total Customers"
              value={kpis.totalCustomers}
              icon="👥"
            />
            <KpiCard title="Churn Rate" value={kpis.churnRate} icon="📉" />
            <KpiCard
              title="Avg. Tenure (Months)"
              value={kpis.avgTenure}
              icon="⏳"
            />
            <KpiCard
              title="Avg. Monthly Charge"
              value={kpis.avgMonthlyCharge}
              icon="💲"
            />
          </dl>
        )}
      </div>

      {/* Project Overview Sections (Optional but Recommended) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-3">The Business Problem</h3>
          <p className="text-gray-700">
            Customer churn is a major challenge for telecom companies... (add
            your description here). This dashboard provides predictive insights
            and allows for interactive scenario planning to proactively address
            churn risks.
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-3">Technology Stack</h3>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>Frontend: Next.js, React, TailwindCSS, Recharts</li>
            <li>Backend: FastAPI, Python</li>
            <li>DWM: Scikit-learn, Pandas, Joblib</li>
            <li>
              Models: Random Forest (Classifier), Linear Regression, K-Means
            </li>
          </ul>
        </div>
      </div>
    </main>
  );
}
