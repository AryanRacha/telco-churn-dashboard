import { RiskProfileResponse } from "@/lib/types";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

// Helper to format feature names nicely for the chart
const formatFeatureName = (name: string): string => {
  // Examples:
  // 'cat__Contract_Month-to-month' -> 'Contract Month-to-month'
  // 'num__tenure' -> 'tenure'
  let cleanName = name.replace(/^(cat__|num__)/, "");
  cleanName = cleanName.replace(/_/g, " "); // Replace underscores
  // Simple CamelCase split (optional, can make names long)
  // cleanName = cleanName.replace(/([A-Z])/g, ' $1').trim();
  return cleanName;
};

export default function RiskProfileCard({
  data,
}: {
  data: RiskProfileResponse;
}) {
  const { classification, top_risk_factors } = data;

  // Prepare data for the feature importance chart
  const importanceChartData = top_risk_factors.map((factor) => ({
    // Use the helper function for cleaner labels
    name: formatFeatureName(factor.feature),
    // Format importance as percentage for display consistency
    Importance: factor.importance * 100,
  }));

  return (
    // Add animation for a smoother appearance
    <div className="p-6 rounded-lg shadow-lg bg-linear-to-br from-white to-gray-100 animate-fade-in lg:sticky lg:top-8">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-2">
        Customer Risk Profile
      </h2>

      {/* 1. The Gauge */}
      <div className="text-center mb-8 p-4 rounded-lg bg-white shadow-inner">
        <div
          className={`text-6xl font-extrabold ${
            classification.prediction === 1 ? "text-red-500" : "text-green-500"
          }`}
        >
          {(classification.probability * 100).toFixed(0)}%
        </div>
        <div
          className={`text-xl font-semibold mt-2 ${
            classification.prediction === 1 ? "text-red-600" : "text-green-600"
          }`}
        >
          Risk Score (
          {classification.prediction === 1
            ? "Likely to Churn"
            : "Likely to Stay"}
          )
        </div>
      </div>

      {/* 2. Top Risk Factors Chart */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-3 text-gray-700">
          Top 3 Risk Factors
        </h3>
        <div className="bg-white p-4 rounded shadow">
          {/* Increased height for better label visibility */}
          <ResponsiveContainer width="100%" height={180}>
            {/* Added layout="vertical" and adjusted margins */}
            <BarChart
              data={importanceChartData}
              layout="vertical"
              margin={{ left: 5, right: 30, top: 5, bottom: 5 }}
            >
              {/* Hide X-axis, it's implied by bar length */}
              <XAxis type="number" hide />
              {/* Y-axis shows the feature names */}
              <YAxis
                type="category"
                dataKey="name"
                width={150} // Increased width for longer feature names
                tick={{ fontSize: 11, fill: "#374151" }} // Smaller font, gray color
                axisLine={false}
                tickLine={false}
                interval={0} // Ensure all labels are shown
              />
              <Tooltip
                cursor={{ fill: "rgba(200,200,200,0.2)" }} // Add subtle hover effect
                formatter={(value: number) => [
                  `${value.toFixed(1)}% Influence`,
                  "Importance",
                ]}
                labelStyle={{ fontSize: 12 }}
                contentStyle={{
                  fontSize: 12,
                  borderRadius: "4px",
                  padding: "5px 10px",
                }}
              />
              {/* Removed Legend - redundant with Y-axis labels */}
              <Bar dataKey="Importance" barSize={20} radius={[0, 4, 4, 0]}>
                {" "}
                {/* Added corner radius */}
                {/* Color cells based on importance ranking */}
                {importanceChartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={["#dc2626", "#f97316", "#facc15"][index % 3]}
                  /> // Red, Orange, Yellow gradient
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
