"use client";

import { useMemo } from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { ClusterDataPoint } from "@/lib/types";

// Define colors for your 3 clusters
const COLORS = ["#8884d8", "#82ca9d", "#ffc658"];

export default function ClusterScatterPlot({
  data,
}: {
  data: ClusterDataPoint[];
}) {
  // We need to separate the data into 3 arrays, one for each cluster
  const clusterData = useMemo(() => {
    const clusters: Record<string, ClusterDataPoint[]> = {
      "0": [],
      "1": [],
      "2": [],
    };

    data.forEach((point) => {
      if (clusters[point.cluster]) {
        clusters[point.cluster].push(point);
      }
    });

    return [
      { name: "Cluster 0", data: clusters["0"] },
      { name: "Cluster 1", data: clusters["1"] },
      { name: "Cluster 2", data: clusters["2"] },
    ];
  }, [data]);

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
          dataKey="tenure"
          name="Tenure"
          unit=" mos"
          fontSize={12}
        />
        <YAxis
          type="number"
          dataKey="monthly_charge"
          name="Monthly Charge"
          unit="$"
          fontSize={12}
        />
        {/* ZAxis is used to control the size of the dots. We'll set it to a fixed size. */}
        <ZAxis type="number" range={[50, 50]} />
        <Tooltip cursor={{ strokeDasharray: "3 3" }} />
        <Legend />

        {/* We map over our 3 cluster arrays to create 3 separate <Scatter> plots */}
        {clusterData.map((cluster, index) => (
          <Scatter
            key={cluster.name}
            name={cluster.name}
            data={cluster.data}
            fill={COLORS[index % COLORS.length]}
          />
        ))}
      </ScatterChart>
    </ResponsiveContainer>
  );
}
