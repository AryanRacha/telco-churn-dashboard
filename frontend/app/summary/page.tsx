import React from "react";

// --- Reusable Icon Components (to make cards look better) ---

// Check icon for solutions
const CheckIcon = () => (
  <div className="shrink-0 w-12 h-12 flex items-center justify-center bg-green-100 rounded-full">
    <svg
      className="w-6 h-6 text-green-600"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 13l4 4L19 7"
      />
    </svg>
  </div>
);

// Lightbulb icon for insights
const InsightIcon = () => (
  <div className="shrink-0 w-12 h-12 flex items-center justify-center bg-blue-100 rounded-full">
    <svg
      className="w-6 h-6 text-blue-600"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m12.728 0l-.707.707M12 21v-1m-6.657-3.343l.707-.707m12.728 0l.707.707"
      />
    </svg>
  </div>
);

// --- Reusable Card for Insights ---
const InsightCard = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="bg-white p-6 rounded-lg shadow-md flex space-x-4">
    <InsightIcon />
    <div>
      <h3 className="text-lg font-semibold mb-1">{title}</h3>
      <p className="text-gray-600">{children}</p>
    </div>
  </div>
);

// --- Main Page Component ---
export default function ConclusionPage() {
  return (
    <main className="p-10">
      <h1 className="text-4xl font-bold mb-4">
        🚀 Conclusion & Recommendations
      </h1>
      <p className="text-lg text-gray-600 mb-10">
        Translating our data analysis and ML models into actionable business
        solutions.
      </p>

      {/* --- 1. Summary of Key Insights (2-Column Grid) --- */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-6 text-gray-800">
          Summary of Key Insights
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <InsightCard title="Contracts are Key">
            "Month-to-Month" contracts are the #1 predictor of churn.
          </InsightCard>
          <InsightCard title="Tenure is Loyalty">
            Churn risk drops dramatically after 12 months. New customers are the
            most at-risk.
          </InsightCard>
          <InsightCard title="Fiber is a 'Hotspot'">
            "Fiber Optic" service has an unusually high churn rate, suggesting a
            price or service issue.
          </InsightCard>
          <InsightCard title="Risky Payments">
            Customers using "Electronic Check" are far more likely to leave than
            those on automatic payments.
          </InsightCard>
        </div>
      </section>

      {/* --- 2. The "Why" (Full-Width Callout) --- */}
      <section className="mb-12">
        <div className="bg-gray-100 p-8 rounded-lg shadow-inner">
          <h2 className="text-3xl font-semibold mb-4 text-gray-800">
            Analysis: Why Is Churn Happening?
          </h2>
          <div className="space-y-4 text-gray-700 leading-relaxed text-lg">
            <p>
              The data tells a clear story: <b>churn is not random.</b> It's
              driven by a{" "}
              <b>lack of commitment and high-friction experiences.</b>
            </p>
            <p>
              The "Month-to-Month" contract is the path of least resistance to
              leaving. This is amplified by the "Electronic Check" payment
              method, which forces customers to <b>manually</b> decide to stay
              every single month. The high churn in "Fiber Optic" (our premium
              service) suggests a major <b>expectation mismatch</b> customers
              are paying more but may not be seeing the value, making them prime
              targets for competitors.
            </p>
          </div>
        </div>
      </section>

      {/* --- 3. Actionable Solutions (3-Column Grid) --- */}
      <section>
        <h2 className="text-3xl font-semibold mb-6 text-gray-800">
          Actionable Solutions & Recommendations
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Solution 1 */}
          <div className="bg-white p-6 rounded-lg shadow-md flex flex-col">
            <CheckIcon />
            <h3 className="text-xl font-semibold my-3">
              1. Focus on Contract Upgrades
            </h3>
            <p className="text-gray-600">
              <span className="font-semibold block mb-2">Action:</span>
              Create a targeted campaign offering a small bonus (e.g., one free
              month) for "Month-to-Month" customers to upgrade to an annual
              plan. Our Playground shows this is the most effective way to
              reduce churn.
            </p>
          </div>

          {/* Solution 2 */}
          <div className="bg-white p-6 rounded-lg shadow-md flex flex-col">
            <CheckIcon />
            <h3 className="text-xl font-semibold my-3">
              2. "First 6 Months" Onboarding
            </h3>
            <p className="text-gray-600">
              <span className="font-semibold block mb-2">Action:</span>
              Target all new customers in our "New, High-Risk" segment.
              Proactively offer them a free add-on like "Tech Support" or
              "Online Security" to build loyalty and prove value *before* they
              think about leaving.
            </p>
          </div>

          {/* Solution 3 */}
          <div className="bg-white p-6 rounded-lg shadow-md flex flex-col">
            <CheckIcon />
            <h3 className="text-xl font-semibold my-3">
              3. Investigate Fiber Service
            </h3>
            <p className="text-gray-600">
              <span className="font-semibold block mb-2">Action:</span>
              The business must immediately investigate the price-to-performance
              of its "Fiber Optic" service. We are losing high-value customers,
              and we must find out if the problem is price, reliability, or poor
              support.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
