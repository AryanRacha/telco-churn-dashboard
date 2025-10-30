"use client";

import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { RegressionDataPoint } from "@/lib/types";

export default function RegressionScatterPlot({
  data,
}: {
  data: RegressionDataPoint[];
}) {
  // Find the max value for our axes
  const maxVal = Math.max(
    ...data.map((d) => d.actual_monthly_charge),
    ...data.map((d) => d.predicted_monthly_charge)
  );

  return (
    <ResponsiveContainer width="100%" height={350}>
      <ScatterChart
        margin={{
          top: 20,
          right: 20,
          bottom: 20,
          left: 20,
        }}
      >
        <XAxis
          type="number"
          dataKey="actual_monthly_charge"
          name="Actual Charge"
          unit="$"
          domain={[0, maxVal + 10]} // Set domain from 0 to max
          fontSize={12}
        />
        <YAxis
          type="number"
          dataKey="predicted_monthly_charge"
          name="Predicted Charge"
          unit="$"
          domain={[0, maxVal + 10]} // Set domain from 0 to max
          fontSize={12}
        />
        <Tooltip cursor={{ strokeDasharray: "3 3" }} />
        <Legend />

        {/* This is the line for a "perfect" prediction (y=x) */}
        <ReferenceLine
          segment={[
            { x: 0, y: 0 },
            { x: maxVal + 10, y: maxVal + 10 },
          ]}
          stroke="red"
          strokeDasharray="4 4"
          label={{ value: "Perfect Prediction", position: "insideTopLeft" }}
        />

        <Scatter
          name="Predictions"
          data={data}
          fill="#8884d8"
          shape="circle"
          opacity={0.5} // Make dots slightly transparent
        />
      </ScatterChart>
    </ResponsiveContainer>
  );
}
