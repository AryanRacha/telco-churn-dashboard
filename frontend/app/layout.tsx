import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link"; // Import the Link component
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Churn Dashboard",
  description: "DWM Project by Aryan",
};

// --- This is our new Sidebar Component ---
// We'll define it right in this file for simplicity
function Sidebar() {
  const navItems = [
    { name: "Home", href: "/", icon: "🏠" },
    { name: "Data Explorer", href: "/explorer", icon: "🗺️" },
    { name: "Model Figures", href: "/figures", icon: "📊" },
    { name: "Live Prediction", href: "/predict", icon: "🎯" },
    { name: "What-If Playground", href: "/playground", icon: "🎮" },
  ];

  return (
    <nav className="w-64 h-screen bg-gray-800 text-white p-4 flex flex-col">
      <h1 className="text-2xl font-bold mb-8">Churn Project</h1>
      <ul className="space-y-2">
        {navItems.map((item) => (
          <li key={item.name}>
            <Link
              href={item.href}
              className="flex items-center p-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <span className="mr-3">{item.icon}</span>
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

// --- This is our main RootLayout ---
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex">
          {/* Column 1: The Sidebar */}
          <Sidebar />

          {/* Column 2: The Main Page Content */}
          <main className="flex-1 h-screen overflow-y-auto bg-gray-50">
            {children} {/* This is where your pages will go */}
          </main>
        </div>
      </body>
    </html>
  );
}
