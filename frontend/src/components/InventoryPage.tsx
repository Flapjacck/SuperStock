import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import type { InventoryItem } from "../types/inventory";
import { InventoryItemCard } from "./InventoryItemCard";

// Temporary mock data - replace with actual API call
const mockInventory: InventoryItem[] = [
  {
    id: "1",
    name: "2-inch Hose",
    description: "Industrial grade suction hose",
    quantity: 50,
    unit: "feet",
    location: "Rack A1",
    minimumQuantity: 20,
  },
  {
    id: "2",
    name: "4-inch Coupling",
    description: "Heavy-duty coupling for main lines",
    quantity: 15,
    unit: "pieces",
    location: "Bin B2",
    minimumQuantity: 5,
  },
  // Add more mock items as needed
];

export function InventoryPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const yardName = location.state?.yardName || "Unknown Yard";
  const [inventory, setInventory] = useState<InventoryItem[]>(mockInventory);
  const [searchQuery, setSearchQuery] = useState("");

  const handleWithdraw = (id: string, amount: number) => {
    setInventory((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(0, item.quantity - amount) }
          : item
      )
    );
  };

  const filteredInventory = inventory.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <motion.div
      className="slide-in bg-slate-900 min-h-screen"
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
        transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
      }}
      exit={{
        opacity: 0,
        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
      }}
    >
      {" "}
      {/* Header */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/")}
              className="group flex items-center gap-2 text-gray-400 hover:text-yellow-400 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              <span className="text-sm font-medium">Back</span>
            </button>
            <div>
              <h1 className="text-3xl font-bold text-white">
                {yardName}
                <span className="text-yellow-400"> Inventory</span>
              </h1>
            </div>
          </div>
        </div>
      </div>
      {/* Search and Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-4 items-center">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search inventory..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-800 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 pl-10"
            />
            <svg
              className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
      </div>
      {/* Inventory Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInventory.map((item) => (
            <InventoryItemCard
              key={item.id}
              item={item}
              onWithdraw={handleWithdraw}
            />
          ))}
        </div>

        {filteredInventory.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">No items found.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
