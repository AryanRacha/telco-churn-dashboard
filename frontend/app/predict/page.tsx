import PredictionForm from "@/components/PredictForm";

export default function PredictPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">🎯 Live Risk Profile</h1>
      <p className="text-lg text-gray-600 mb-8">
        Enter a customer's details to get a real-time churn prediction and see
        the factors driving their risk.
      </p>

      {/* --- 2. Simplified Layout --- */}
      {/* Let the PredictionForm component handle its own layout */}
      <div className="max-w-4xl mx-auto">
        {" "}
        {/* Center the content */}
        <PredictionForm />
      </div>
    </div>
  );
}
