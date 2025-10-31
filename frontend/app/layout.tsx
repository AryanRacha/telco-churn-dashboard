import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link"; // Use Next.js Link for fast navigation
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Churn Dashboard",
  description: "DWM Project",
};

// --- Sidebar Component ---
// Defined here for simplicity
function Sidebar() {
  // This array defines our 5-page navigation
  const navItems = [
    { name: "Home", href: "/", icon: "🏠" },
    { name: "Dataset Explorer", href: "/explorer", icon: "📊" },
    { name: "Model Insights", href: "/insights", icon: "💡" },
    { name: "Live Playground", href: "/playground", icon: "🎮" },
    { name: "Conclusion", href: "/conclusion", icon: "🚀" },
  ];

  return (
    <nav className="w-64 h-screen bg-gray-800 text-white p-5 flex flex-col shadow-lg">
      <div className="text-2xl font-bold mb-10">DWM Churn Project</div>
      <ul className="space-y-3">
        {navItems.map((item) => (
          <li key={item.name}>
            <Link
              href={item.href}
              className="flex items-center p-3 rounded-lg text-gray-200 hover:bg-gray-700 hover:text-white transition-colors duration-200"
            >
              <span className="mr-3 text-xl">{item.icon}</span>
              <span className="font-medium">{item.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

// --- Main RootLayout ---
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex">
          {/* Column 1: The Sidebar (stays on every page) */}
          <Sidebar />

          {/* Column 2: The Main Page Content */}
          <main className="flex-1 h-screen overflow-y-auto bg-gray-50">
            {/* 'children' will be your Page 1, Page 2, etc. */}
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
