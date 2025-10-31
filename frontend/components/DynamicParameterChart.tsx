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
  CartesianGrid,
} from "recharts";
import { Customer } from "@/lib/types";

interface ChartProps {
  data: Customer[];
  parameter: keyof Customer; // The name of the parameter to group by
}

export default function DynamicParameterChart({ data, parameter }: ChartProps) {
  const chartData = useMemo(() => {
    // 1. Group customers by the selected parameter
    const groups = data.reduce((acc, customer) => {
      const key = String(customer[parameter]); // e.g., "Month-to-month"

      if (!acc[key]) {
        acc[key] = { total: 0, churnYes: 0 };
      }

      acc[key].total += 1;
      if (customer.Churn === "Yes") {
        acc[key].churnYes += 1;
      }
      return acc;
    }, {} as Record<string, { total: number; churnYes: number }>);

    // 2. Format for the chart, calculating 'Stayed (No)'
    return Object.entries(groups)
      .map(([name, { total, churnYes }]) => ({
        name: name === "0" ? "No" : name === "1" ? "Yes" : name, // Fix for SeniorCitizen
        "Churn (Yes)": churnYes,
        "Stayed (No)": total - churnYes,
      }))
      .sort((a, b) => b["Churn (Yes)"] - a["Churn (Yes)"]); // Sort by highest churn count
  }, [data, parameter]); // Re-calculate when data or parameter changes

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={chartData}
        margin={{ top: 5, right: 20, left: 10, bottom: 40 }} // Increased bottom margin for labels
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="name"
          fontSize={12}
          interval={0} // Show all labels
          angle={-30} // Angle labels
          textAnchor="end" // Anchor to the end
        />
        <YAxis
          allowDecimals={false} // We are showing counts
          fontSize={12}
          label={{
            value: "Number of Customers",
            angle: -90,
            position: "insideLeft",
            dx: -5,
          }}
        />
        <Tooltip />
        <Legend verticalAlign="top" />
        {/* These two <Bar> components create the grouped chart */}
        <Bar
          dataKey="Churn (Yes)"
          fill="#dc2626" // Red
          name="Churn (Yes)"
        />
        <Bar
          dataKey="Stayed (No)"
          fill="#16a34a" // Green
          name="Stayed (No)"
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
