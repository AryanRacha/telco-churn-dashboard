import LivePlayground from "@/components/LivePlayground"; // We will create this

export default function PlaygroundPage() {
  return (
    <main className="p-10">
      <h1 className="text-4xl font-bold mb-4">🎮 Live Playground</h1>
      <p className="text-lg text-gray-600 mb-8">
        A fully interactive simulator. Tweak any of the 19 customer parameters
        and see the churn risk update in real-time.
      </p>

      {/* This one component will handle everything */}
      <LivePlayground />
    </main>
  );
}
