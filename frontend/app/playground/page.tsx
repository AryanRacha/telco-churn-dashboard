import WhatIfSimulator from "@/components/WhatIfSimulator";

export default function PlaygroundPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">🎮 What-If Playground</h1>
      <p className="text-lg text-gray-600 mb-8">
        Interactively explore how changing key factors impacts a customer's
        churn risk. See the model's predictions change in real-time!
      </p>

      {/* The main simulator component handles the layout */}
      <WhatIfSimulator />
    </div>
  );
}
