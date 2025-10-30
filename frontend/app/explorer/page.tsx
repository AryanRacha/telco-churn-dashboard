"use client";

import { useState, useEffect, useMemo } from "react";
import { getExplorerData } from "@/lib/api";
import { Customer } from "@/lib/types";

// We'll import our charts here later
import ChurnByContractChart from "@/components/ChurnByContractChart";
import TenureChurnChart from "@/components/TenureChurnChart"; // We can add this import now

export default function ExplorerPage() {
  // --- State Hooks ---
  const [allData, setAllData] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- Filter State Hooks ---
  const [contractFilter, setContractFilter] = useState("All");
  const [internetServiceFilter, setInternetServiceFilter] = useState("All");

  // --- Data Fetching Effect ---
  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getExplorerData();
        setAllData(data);
      } catch (err) {
        setError("Failed to fetch data from the API.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  // --- Data Filtering Logic ---
  const filteredData = useMemo(() => {
    return allData.filter((customer) => {
      // Check contract filter
      const contractMatch =
        contractFilter === "All" || customer.Contract === contractFilter;

      // Check internet service filter
      const internetServiceMatch =
        internetServiceFilter === "All" ||
        customer.InternetService === internetServiceFilter;

      return contractMatch && internetServiceMatch;
    });
  }, [allData, contractFilter, internetServiceFilter]);

  // --- Loading and Error Handling ---
  if (isLoading) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold">Loading Explorer Data...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold text-red-600">Error</h1>
        <p>{error}</p>
      </div>
    );
  }

  // --- Main Page Render ---
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-4">🗺️ Data Explorer</h1>
      <p className="text-lg text-gray-600 mb-6">
        Interactively filter your customer data to find insights.
      </p>{" "}
      {/* <--- 
        
      {/* --- Filter Bar --- */}
      <div className="flex space-x-4 p-4 bg-white rounded-lg shadow mb-8">
        {/* Filter 1: Contract Type */}
        <div>
          <label
            htmlFor="contract-filter"
            className="block text-sm font-medium text-gray-700"
          >
            Contract Type
          </label>
          <select
            id="contract-filter"
            value={contractFilter}
            onChange={(e) => setContractFilter(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option>All</option>
            <option>Month-to-month</option>
            <option>One year</option>
            <option>Two year</option>
          </select>
        </div>

        {/* Filter 2: Internet Service */}
        <div>
          <label
            htmlFor="internet-filter"
            className="block text-sm font-medium text-gray-700"
          >
            Internet Service
          </label>
          <select
            id="internet-filter"
            value={internetServiceFilter}
            onChange={(e) => setInternetServiceFilter(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option>All</option>
            <option>DSL</option>
            <option>Fiber optic</option>
            <option>No</option>
          </select>
        </div>
      </div>
      {/* --- Data Display --- */}
      <div className="p-4 bg-white rounded-lg shadow mb-8">
        <h2 className="text-xl font-semibold">
          Showing {filteredData.length} of {allData.length} customers
        </h2>
      </div>
      {/* --- Charts Area --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">
            Churn Rate by Contract Type
          </h3>
          <ChurnByContractChart data={filteredData} />
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">
            Average Tenure vs. Churn
          </h3>
          <TenureChurnChart data={filteredData} />
        </div>
      </div>
    </div>
  );
}
