import StaticChartCard from "@/components/StaticChartCard"; // <-- 1. Import our component

export default function InsightsPage() {
  return (
    <main className="p-10">
      <h1 className="text-4xl font-bold mb-4">💡 Model Insights</h1>
      <p className="text-lg text-gray-600 mb-8">
        This is the "report" showing the results of our three ML models from the
        training script.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* --- 1. K-Means (Static) --- */}
        <StaticChartCard
          title="K-Means Customer Segments"
          description="Shows the 3 distinct customer segments found by our K-Means model."
          imgSrc="kmeans_clusters.svg"
        />

        {/* --- 2. Regression (Static) --- */}
        <StaticChartCard
          title="Regression: Actual vs. Predicted"
          description="Shows how well our Linear Regression model predicts `MonthlyCharges`."
          imgSrc="regression_actual_vs_pred.svg"
        />

        {/* --- 3. Feature Importance (Static) --- */}
        <StaticChartCard
          title="Classifier: Feature Importance"
          description="The top 10 features our Random Forest model uses to predict churn."
          imgSrc="feature_importance.svg"
        />

        {/* --- 4. Confusion Matrix (Static) --- */}
        <StaticChartCard
          title="Classifier: Confusion Matrix"
          description="The official 'report card' for our classifier on the test data."
          imgSrc="confusion_matrix.svg"
        />
      </div>
    </main>
  );
}
