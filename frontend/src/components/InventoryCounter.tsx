import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

interface InventoryItem {
  name: string;
  location: string;
  uom: string;
  minStock: number;
  qtyOnHand?: number;
}

// Custom hook to manage inventory state with localStorage persistence
function useInventoryState(yardId: string | undefined) {
  // Load initial state
  const [items, setItems] = useState<InventoryItem[]>(() => {
    try {
      const savedInventory = localStorage.getItem(`inventory-${yardId}`);
      if (savedInventory) {
        const savedItems = JSON.parse(savedInventory);
        // Always use saved items if they exist, don't merge with defaults
        return savedItems;
      }
    } catch (error) {
      console.error("Error loading inventory:", error);
    }
    // If no saved inventory, use default items
    return yardInventory[yardId || "peters-corner"] || [];
  });

  const [currentItemIndex, setCurrentItemIndex] = useState(() => {
    try {
      const savedIndex = localStorage.getItem(`currentIndex-${yardId}`);
      if (savedIndex) {
        const index = parseInt(savedIndex, 10);
        return index < items.length ? index : 0;
      }
    } catch (error) {
      console.error("Error loading current index:", error);
    }
    return 0;
  });

  // Save state synchronously
  const saveState = useCallback(() => {
    try {
      localStorage.setItem(`inventory-${yardId}`, JSON.stringify(items));
      localStorage.setItem(`currentIndex-${yardId}`, currentItemIndex.toString());
    } catch (error) {
      console.error("Error saving state:", error);
    }
  }, [items, currentItemIndex, yardId]);

  // Save state whenever items or currentItemIndex changes
  useEffect(() => {
    saveState();
  }, [items, currentItemIndex, saveState]);

  // Function to update an item's quantity
  const updateItemQuantity = useCallback((index: number, quantity: number | undefined) => {
    setItems(prevItems => {
      const newItems = [...prevItems];
      if (quantity !== undefined) {
        newItems[index] = { ...newItems[index], qtyOnHand: quantity };
      }
      localStorage.setItem(`inventory-${yardId}`, JSON.stringify(newItems));
      return newItems;
    });
  }, [yardId]);

  return {
    items,
    setItems,
    currentItemIndex,
    setCurrentItemIndex,
    updateItemQuantity,
    saveState
  };
}

// Sample inventory items - in production this would come from an API or database
const yardInventory: Record<string, InventoryItem[]> = {
  "peters-corner": [],
  hazel: [
    { name: "Summer Gloves - M", location: "Office Seacan", uom: "Bag", minStock: 1 },
    { name: "Summer Gloves - L", location: "Office Seacan", uom: "Bag", minStock: 1 },
    { name: "Summer Gloves - XL", location: "Office Seacan", uom: "Bag", minStock: 1 },
    { name: "Winter Gloves - M", location: "Office Seacan", uom: "Bag", minStock: 1 },
    { name: "Winter Gloves - L", location: "Office Seacan", uom: "Bag", minStock: 1 },
    { name: "Winter Gloves - XL", location: "Office Seacan", uom: "Bag", minStock: 1 },
    { name: "Handles", location: "Office Seacan", uom: "x1", minStock: 10 },
    { name: "Rotators", location: "Office Seacan", uom: "x1", minStock: 10 },
    { name: "Duct Tape", location: "Office Seacan", uom: "Box", minStock: 2 },
    { name: "Clear Glasses", location: "Office Seacan", uom: "Box", minStock: 3 },
    { name: "Dark Glasses", location: "Office Seacan", uom: "Box", minStock: 3 },
    { name: "Rubber Dipped Gloves", location: "Office Seacan", uom: "Bag", minStock: 3 },
    { name: "Nitrile Gloves", location: "Office Seacan", uom: "Box", minStock: 2 },
    { name: "Ear Plugs", location: "Office Seacan", uom: "Box", minStock: 2 },
    { name: "N-95 Masks", location: "Office Seacan", uom: "Box", minStock: 2 },
    { name: "Hammers", location: "Office Seacan", uom: "Box", minStock: 2 },
    { name: "Tape Measures", location: "Office Seacan", uom: "Box", minStock: 2 },
    { name: "Knives", location: "Office Seacan", uom: "Box", minStock: 2 },
    { name: "Heat Gun", location: "Office Seacan", uom: "x1", minStock: 6 },
    { name: "Booster Cable", location: "Office Seacan", uom: "x1", minStock: 5 },
    { name: "Torch", location: "Office Seacan", uom: "x1", minStock: 6 },
    { name: "Level", location: "Office Seacan", uom: "x1", minStock: 6 },
    { name: "Multi-purpose Grease", location: "Office Seacan", uom: "x1", minStock: 6 },
    { name: "Grease Gun", location: "Office Seacan", uom: "x1", minStock: 3 },
    { name: "Hard Hats", location: "Office Seacan", uom: "x1", minStock: 12 },
    { name: "Hard Hat Liner Mount", location: "Office Seacan", uom: "x1", minStock: 12 },
    { name: "Clip on Hearing Protection", location: "Office Seacan", uom: "x1", minStock: 10 },
    { name: "Faceshield", location: "Office Seacan", uom: "x1", minStock: 20 },
    { name: "Faceshield Mount", location: "Office Seacan", uom: "x1", minStock: 10 },
    { name: "Dig Lights", location: "Office Seacan", uom: "x1", minStock: 5 },
    { name: "Dig Light Extension Cord", location: "Office Seacan", uom: "x1", minStock: 5 },
    { name: "Tyvek Suit XL", location: "Office Seacan", uom: "Box", minStock: 1 },
    { name: "Tyvek Suit XXL", location: "Office Seacan", uom: "Box", minStock: 1 },
    { name: "Optime 105", location: "Office Seacan", uom: "x1", minStock: 10 },
    { name: "PVC Gloves", location: "Office Seacan", uom: "Bag", minStock: 2 },
    { name: "Splash Goggles", location: "Office Seacan", uom: "x1", minStock: 10 },
    { name: "6x6 Tarps", location: "Office Seacan", uom: "x1", minStock: 3 },
    { name: "Headlamps", location: "Office Seacan", uom: "x1", minStock: 12 },
    { name: "Whip Checks", location: "Office Seacan", uom: "x1", minStock: 10 },
    { name: "Root Saw", location: "Office Seacan", uom: "x1", minStock: 10 },
    { name: "Hack Saw", location: "Office Seacan", uom: "x1", minStock: 10 },
    { name: "4 in Clamp", location: "Office Seacan", uom: "x1", minStock: 20 },
    { name: "6 in Clamp", location: "Office Seacan", uom: "x1", minStock: 20 },
    { name: "8 in Clamp", location: "Office Seacan", uom: "x1", minStock: 20 },
    { name: "Spill Kits", location: "Office Seacan", uom: "x1", minStock: 10 },
    { name: "Bungie Cords", location: "Office Seacan", uom: "x1", minStock: 50 },
    { name: "FIT-OC38F-SS", location: "Office Seacan", uom: "x1", minStock: 50 },
    { name: "FIT-QCN38M-SS", location: "Office Seacan", uom: "x1", minStock: 50 },
    { name: "FIT-QCN38F-SS", location: "Office Seacan", uom: "x1", minStock: 50 },
    { name: "FIT-S1010-CB", location: "Office Seacan", uom: "x1", minStock: 50 },
    { name: "FIT-S1022-CB", location: "Office Seacan", uom: "x1", minStock: 50 },
    { name: "O-rings", location: "Office Seacan", uom: "x1", minStock: 100 },
    { name: "5ft Wands", location: "Office Seacan", uom: "x1", minStock: 10 },
    { name: "6ft Wands", location: "Office Seacan", uom: "x1", minStock: 10 },
    { name: "2in Camlock - 3in Camlock", location: "Office Seacan", uom: "x1", minStock: 6 },
    { name: "2.5in Camlock -3in Camlock", location: "Office Seacan", uom: "x1", minStock: 6 },
    { name: "3in Camlock -1.5in Camlock", location: "Office Seacan", uom: "x1", minStock: 6 },
    { name: "3in Camlock -Hydrant", location: "Office Seacan", uom: "x1", minStock: 6 },
    { name: "Rope", location: "Office Seacan", uom: "Roll", minStock: 1 },
    { name: "8-6 Reducer", location: "Office Seacan", uom: "x1", minStock: 6 },
    { name: "6-4 Reducer", location: "Office Seacan", uom: "x1", minStock: 6 },
    { name: "Foam Cannon", location: "Office Seacan", uom: "x1", minStock: 2 },
    { name: "Muriatic Acid", location: "Office Seacan", uom: "x1", minStock: 2 },
    { name: "Bleach", location: "Office Seacan", uom: "x1", minStock: 4 },
    { name: "Glass Cleaner", location: "Office Seacan", uom: "x1", minStock: 4 },
    { name: "Big Red Cleaner", location: "Office Seacan", uom: "x1", minStock: 4 },
    { name: "Bioscrub", location: "Office Seacan", uom: "x1", minStock: 4 },
    { name: "Spray Bottles", location: "Office Seacan", uom: "Box", minStock: 1 },
    { name: "Pump Bottles", location: "Office Seacan", uom: "Box", minStock: 1 },
    { name: "Orange Peeler", location: "Office Seacan", uom: "x1", minStock: 2 },
    { name: "Rags", location: "Office Seacan", uom: "Bag", minStock: 2 },
    { name: "Ex-con Concrete Remover", location: "Office Seacan", uom: "x1", minStock: 2 },
    { name: "Axel Oil", location: "Office Seacan", uom: "x1", minStock: 6 },
    { name: "WD-40", location: "Office Seacan", uom: "x1", minStock: 6 },
    { name: "2 Stroke Oil", location: "Office Seacan", uom: "x1", minStock: 6 },
    { name: "AA Batteries", location: "Office Seacan", uom: "Pack", minStock: 1 },
    { name: "AAA Batteries", location: "Office Seacan", uom: "Pack", minStock: 1 },
    { name: "Carabiners", location: "Office Seacan", uom: "Box", minStock: 2 },
    { name: "Hitch Pins", location: "Office Seacan", uom: "x1", minStock: 15 },
    { name: "Flusher Nozzle", location: "Office Seacan", uom: "x1", minStock: 6 },
    { name: "Pencil Tip", location: "Office Seacan", uom: "x1", minStock: 6 },
    { name: "Fan Tip", location: "Office Seacan", uom: "x1", minStock: 6 },
    { name: "Shear Pins", location: "Office Seacan", uom: "x1", minStock: 10 },
    { name: "Air Monitors", location: "Office Seacan", uom: "x1", minStock: 4 },
    { name: "Radios", location: "Office Seacan", uom: "x1", minStock: 6 },
    { name: "Chisel Paste", location: "Office Seacan", uom: "x1", minStock: 6 }
  ],
};

export function InventoryCounter() {
  const { yardId } = useParams<{ yardId: string }>();
  const navigate = useNavigate();
  const { 
    items, 
    setItems,
    currentItemIndex, 
    setCurrentItemIndex,
    updateItemQuantity,
    saveState 
  } = useInventoryState(yardId);
  const [inputValue, setInputValue] = useState("");

  // Save state before unmounting
  useEffect(() => {
    return () => {
      saveState();
    };
  }, [saveState]);

  const handleNumberInput = (num: number) => {
    if (currentItemIndex >= items.length) return;
    
    updateItemQuantity(currentItemIndex, num);
    setInputValue("");

    if (currentItemIndex < items.length - 1) {
      setCurrentItemIndex(prev => prev + 1);
    }
  };

  const handleClearInput = () => {
    setInputValue("");
  };

  const handlePrevious = () => {
    if (currentItemIndex > 0) {
      saveState(); // Save state before navigating
      setCurrentItemIndex(prev => prev - 1);
      setInputValue("");
    }
  };

  const handleBack = () => {
    saveState(); // Save state before navigating
    navigate("/");
  };

  const currentItem = items[currentItemIndex];

  // Clear inventory button in summary view
  const handleClearInventory = () => {
    if (window.confirm("Are you sure you want to clear all inventory counts? This cannot be undone.")) {
      localStorage.removeItem(`inventory-${yardId}`);
      localStorage.removeItem(`currentIndex-${yardId}`);
      const freshItems = yardInventory[yardId || "peters-corner"] || [];
      setItems(freshItems);
      setCurrentItemIndex(0);
    }
  };

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
            <div className="bg-slate-700 rounded-lg p-3 mb-4">
              <p className="text-yellow-400 font-semibold">
                Location: {currentItem?.location}
              </p>
            </div>
            <h2 className="text-2xl font-bold mb-2">{currentItem?.name}</h2>
            <div className="flex justify-between text-sm text-gray-400 mb-2">
              <span>UOM: {currentItem?.uom}</span>
              <span>Min Stock: {currentItem?.minStock}</span>
            </div>
            <div className="text-4xl font-bold text-center p-4 bg-slate-900 rounded-lg mb-6">
              {inputValue ||
                (currentItem?.qtyOnHand === undefined
                  ? ""
                  : currentItem.qtyOnHand)}
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
                onClick={handleClearInput}
                className="bg-amber-500 hover:bg-amber-400 text-slate-900 rounded-lg p-4 text-xl font-bold transition-colors"
              >
                Clear
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
              <div className="space-y-4">
                {items.map((item: InventoryItem, index: number) => (
                  <div key={index} className="bg-slate-700 rounded-lg p-3">
                    <p className="text-yellow-400 font-semibold mb-1">
                      {item.location}
                    </p>
                    <div className="flex justify-between mb-1">
                      <span>{item.name}</span>
                      <span className="font-bold text-yellow-400">
                        {item.qtyOnHand}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-400">
                      <span>UOM: {item.uom}</span>
                      <span>Min Stock: {item.minStock}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex flex-col gap-3 mt-6">
                <button
                  onClick={handleBack}
                  className="w-full bg-yellow-400 hover:bg-yellow-300 text-slate-900 rounded-lg p-3 font-bold transition-colors"
                >
                  Return to Yards
                </button>
                <button
                  onClick={handleClearInventory}
                  className="w-full bg-red-500 hover:bg-red-400 text-white rounded-lg p-3 font-bold transition-colors"
                >
                  Clear Inventory
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
