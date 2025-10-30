"use client";

import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Customer } from "@/lib/types";

// This component expects to receive the (already filtered) data
export default function ChurnByContractChart({ data }: { data: Customer[] }) {
  // We need to transform the raw data into aggregated data for the chart.
  // 'useMemo' ensures this calculation only re-runs when 'data' changes.
  const chartData = useMemo(() => {
    // 1. Group customers by contract type
    const groups = data.reduce((acc, customer) => {
      const contract = customer.Contract;
      if (!acc[contract]) {
        acc[contract] = { total: 0, churn: 0 };
      }
      acc[contract].total += 1;
      if (customer.Churn === 1) {
        acc[contract].churn += 1;
      }
      return acc;
    }, {} as Record<string, { total: number; churn: number }>);

    // 2. Calculate churn rate for each group
    return Object.entries(groups).map(([name, { total, churn }]) => ({
      name, // "Month-to-month", "One year", "Two year"
      Total: total,
      Churn: churn,
      ChurnRate: total > 0 ? churn / total : 0,
    }));
  }, [data]);

  return (
    // ResponsiveContainer makes the chart fill its parent div
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={chartData}
        margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
      >
        <XAxis dataKey="name" fontSize={12} />
        <YAxis
          tickFormatter={(tick) => `${(tick * 100).toFixed(0)}%`}
          fontSize={12}
        />
        <Tooltip
          formatter={(value: number) => [
            (value * 100).toFixed(1) + "%",
            "Churn Rate",
          ]}
        />
        <Legend />
        <Bar dataKey="ChurnRate" fill="#8884d8" name="Churn Rate" />
      </BarChart>
    </ResponsiveContainer>
  );
}
