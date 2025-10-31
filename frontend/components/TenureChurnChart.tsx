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
  ReferenceLine,
  Cell,
} from "recharts";
import { Customer } from "@/lib/types";

export default function TenureChurnChart({ data }: { data: Customer[] }) {
  // We need to calculate the *average* tenure for churned vs. non-churned
  const chartData = useMemo(() => {
    let churnTotal = 0;
    let churnCount = 0;
    let stayTotal = 0;
    let stayCount = 0;

    data.forEach((customer) => {
      if (customer.Churn === "Yes") {
        churnTotal += customer.tenure;
        churnCount += 1;
      } else {
        stayTotal += customer.tenure;
        stayCount += 1;
      }
    });

    return [
      {
        name: "Did Not Churn",
        AverageTenure: stayCount > 0 ? stayTotal / stayCount : 0,
      },
      {
        name: "Churned",
        AverageTenure: churnCount > 0 ? churnTotal / churnCount : 0,
      },
    ];
  }, [data]);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={chartData}
        margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
      >
        <XAxis dataKey="name" fontSize={12} />
        <YAxis
          label={{
            value: "Avg. Tenure (Months)",
            angle: -90,
            position: "insideLeft",
            dx: -10,
          }}
          fontSize={12}
        />
        <Tooltip
          formatter={(value: number) => [
            value.toFixed(1) + " months",
            "Average Tenure",
          ]}
        />
        <Legend />
        <ReferenceLine y={0} stroke="#000" />
        <Bar dataKey="AverageTenure" name="Average Tenure">
          {/* This colors the bars differently */}
          {chartData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={entry.name === "Churned" ? "#FF8042" : "#82ca9d"}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
