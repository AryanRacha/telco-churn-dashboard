"use client";

import { useState, useEffect, useMemo } from "react";
import { getExplorerData } from "@/lib/api";
import { Customer } from "@/lib/types";
import KpiCard from "@/components/ui/KpiCard";
// --- End of Component ---

export default function HomePage() {
  const [data, setData] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data on component mount to calculate KPIs
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

  // Calculate KPIs
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
      churnRate: churnRate.toFixed(1) + "%",
      avgTenure: avgTenure.toFixed(0),
      avgMonthlyCharge: "$" + avgMonthlyCharge.toFixed(2),
    };
  }, [data]);

  return (
    <main className="p-10">
      {/* 1. Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold mb-2">
          🏠 Proactive Customer Churn Dashboard
        </h1>
        <p className="text-lg text-gray-600">
          An interactive dashboard for DWM project.
        </p>
      </div>

      {/* 2. KPI Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">
          Project KPIs
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

      {/* 3. Project Explanation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-3">The Business Problem</h3>
          <p className="text-gray-700 leading-relaxed">
            Customer churn, or the rate at which customers leave, is a critical
            and expensive problem for businesses. This project builds a
            full-stack tool that moves beyond simple, reactive analysis to
            provide a proactive solution for understanding and preventing churn.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-3">Our Solution</h3>
          <div className="text-gray-700 leading-relaxed">
            This dashboard uses data analysis and machine learning to answer
            three key questions:
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>
                <b>What's happening?</b> (See the Dataset Explorer)
              </li>
              <li>
                <b>Why is it happening?</b> (See the Model Insights)
              </li>
              <li>
                <b>What can we do?</b> (See the Live Playground)
              </li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
