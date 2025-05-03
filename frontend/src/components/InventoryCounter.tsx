import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

interface InventoryItem {
  id: number;
  name: string;
  count: number | "N/A";
}

// Sample inventory items - in production this would come from an API or database
const yardInventory: Record<string, InventoryItem[]> = {
  "peters-corner": [
    { id: 1, name: "Truck 1", count: 0 },
    { id: 2, name: "Truck 2", count: 0 },
    { id: 3, name: "Storage", count: 0 },
  ],
  hazel: [
    { id: 1, name: "Storage", count: 0 },
    { id: 2, name: "Service", count: 0 },
    { id: 3, name: "Tools", count: 0 },
  ],
};

export function InventoryCounter() {
  const { yardId } = useParams<{ yardId: string }>();
  const navigate = useNavigate();
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [items, setItems] = useState(
    yardInventory[yardId || "peters-corner"] || []
  );
  const [inputValue, setInputValue] = useState("");

  const handleNumberInput = (num: number | "N/A") => {
    if (currentItemIndex >= items.length) return;

    const newItems = [...items];
    newItems[currentItemIndex].count = num;
    setItems(newItems);
    setInputValue("");

    if (currentItemIndex < items.length - 1) {
      setCurrentItemIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentItemIndex > 0) {
      setCurrentItemIndex((prev) => prev - 1);
      setInputValue("");
    }
  };

  const handleBack = () => {
    navigate("/");
  };

  const currentItem = items[currentItemIndex];

  return (
    <motion.div
      className="slide-in bg-slate-900"
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
        transition: {
          duration: 0.8,
          ease: [0.22, 1, 0.36, 1],
          delay: 0.2,
        },
      }}
      exit={{
        opacity: 0,
        transition: {
          duration: 0.6,
          ease: [0.22, 1, 0.36, 1],
        },
      }}
    >
      <div className="min-h-screen text-white p-4">
        <div className="max-w-md mx-auto space-y-6">
          {/* Back button */}
          <button
            onClick={handleBack}
            className="mb-4 text-yellow-400 hover:text-yellow-300 flex items-center group"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2 transform transition-transform group-hover:-translate-x-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            Back to Yards
          </button>

          {/* Progress indicator */}
          <div className="bg-slate-800 rounded-lg p-4">
            <div className="text-sm text-gray-400">
              Item {currentItemIndex + 1} of {items.length}
            </div>
            <div className="w-full bg-slate-900 rounded-full h-2 mt-2">
              <div
                className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${(currentItemIndex / items.length) * 100}%`,
                }}
              />
            </div>
          </div>

          {/* Current item display */}
          <div className="bg-slate-800 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">{currentItem?.name}</h2>
            <div className="text-4xl font-bold text-center p-4 bg-slate-900 rounded-lg mb-6">
              {inputValue || currentItem?.count || "0"}
            </div>

            {/* Previous/Next navigation */}
            <div className="flex justify-between mb-4">
              <button
                onClick={handlePrevious}
                disabled={currentItemIndex === 0}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  currentItemIndex === 0
                    ? "bg-slate-700 text-slate-500"
                    : "bg-yellow-400 hover:bg-yellow-300 text-slate-900"
                }`}
              >
                Previous
              </button>
              <div className="text-slate-400">
                {currentItemIndex + 1} / {items.length}
              </div>
            </div>

            {/* Number pad */}
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <button
                  key={num}
                  onClick={() => setInputValue((prev) => prev + num.toString())}
                  className="bg-slate-700 hover:bg-slate-600 rounded-lg p-4 text-xl font-bold transition-colors"
                >
                  {num}
                </button>
              ))}
              <button
                onClick={() => handleNumberInput("N/A")}
                className="bg-amber-500 hover:bg-amber-400 text-slate-900 rounded-lg p-4 text-xl font-bold transition-colors"
              >
                N/A
              </button>
              <button
                onClick={() => setInputValue((prev) => prev + "0")}
                className="bg-slate-700 hover:bg-slate-600 rounded-lg p-4 text-xl font-bold transition-colors"
              >
                0
              </button>
              <button
                onClick={() => handleNumberInput(Number(inputValue) || 0)}
                className="bg-yellow-400 hover:bg-yellow-300 text-slate-900 rounded-lg p-4 text-xl font-bold transition-colors"
              >
                ✓
              </button>
            </div>
          </div>

          {/* Summary (only shown when complete) */}
          {currentItemIndex === items.length && (
            <div className="bg-slate-800 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">Inventory Complete</h2>
              <div className="space-y-2">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <span>{item.name}</span>
                    <span className="font-bold text-yellow-400">
                      {item.count}
                    </span>
                  </div>
                ))}
              </div>
              <button
                onClick={handleBack}
                className="mt-6 w-full bg-yellow-400 hover:bg-yellow-300 text-slate-900 rounded-lg p-3 font-bold transition-colors"
              >
                Return to Yards
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
