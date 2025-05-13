import { useState } from "react";
import type { InventoryItem } from "../types/inventory";

interface InventoryItemCardProps {
  item: InventoryItem;
  onWithdraw: (id: string, amount: number) => void;
}

export function InventoryItemCard({
  item,
  onWithdraw,
}: InventoryItemCardProps) {
  const [withdrawAmount, setWithdrawAmount] = useState(1);
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  const handleWithdraw = () => {
    onWithdraw(item.id, withdrawAmount);
    setWithdrawAmount(1);
    setIsWithdrawing(false);
  };

  const isLowStock =
    item.minimumQuantity && item.quantity <= item.minimumQuantity;

  return (
    <div className="group relative rounded-lg overflow-hidden bg-slate-800 hover:bg-slate-700/80 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl">
      <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/0 via-yellow-400/5 to-yellow-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="p-6 relative">
        <div className="flex justify-between items-start">
          <div>
            {" "}
            <h3 className="text-xl font-semibold text-white group-hover:text-yellow-400 transition-colors">
              {item.name}
            </h3>
            <div className="flex items-center text-gray-400 text-sm mt-1 gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span>{item.location}</span>
            </div>
          </div>
          <div className="text-right">
            <div
              className={`text-lg font-bold ${
                isLowStock ? "text-red-400" : "text-yellow-400"
              }`}
            >
              {item.quantity} {item.unit}
            </div>
          </div>
        </div>

        {isWithdrawing ? (
          <div className="mt-4 flex items-center gap-4">
            <input
              type="number"
              min="1"
              max={item.quantity}
              value={withdrawAmount}
              onChange={(e) =>
                setWithdrawAmount(
                  Math.max(
                    1,
                    Math.min(item.quantity, parseInt(e.target.value) || 1)
                  )
                )
              }
              className="bg-slate-900 text-white px-3 py-2 rounded-md w-24 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <button
              onClick={handleWithdraw}
              className="bg-yellow-400 text-slate-900 px-4 py-2 rounded-md font-medium hover:bg-yellow-300 transition-colors"
            >
              Confirm
            </button>
            <button
              onClick={() => setIsWithdrawing(false)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsWithdrawing(true)}
            className="mt-4 text-yellow-400 hover:text-yellow-300 transition-colors text-sm font-medium flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clipRule="evenodd"
              />
            </svg>
            Withdraw
          </button>
        )}
      </div>
    </div>
  );
}
