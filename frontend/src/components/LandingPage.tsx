import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export function LandingPage() {
  const navigate = useNavigate();
  return (
    <motion.div
      className="slide-in bg-slate-900"
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
        transition: {
          duration: 0.8,
          ease: [0.22, 1, 0.36, 1],
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
      {/* Hero Section with animated gradient */}
      <div className="relative overflow-hidden min-h-[50vh] flex items-center">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 animate-gradient-shift" />
        <div className="absolute inset-0">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute transform -rotate-45 left-1/2 top-1/2 w-[200%] h-40 bg-gradient-to-r from-yellow-400/20 to-transparent animate-pulse" />
            <div className="absolute transform rotate-45 left-1/2 top-1/2 w-[200%] h-40 bg-gradient-to-r from-yellow-400/20 to-transparent animate-pulse delay-700" />
          </div>
        </div>

        <div className="relative z-20 px-4 py-16 sm:px-6 lg:px-8 w-full">
          <div className="mx-auto max-w-7xl">
            <div className="text-center">
              <h1 className="text-5xl font-bold tracking-tight text-white sm:text-7xl mb-4 drop-shadow-lg">
                Super
                <span className="text-yellow-400">Stock</span>
              </h1>
              <div className="h-1 w-32 bg-yellow-400 mx-auto rounded-full mb-6" />
              <p className="mt-6 text-xl leading-8 text-gray-300 max-w-2xl mx-auto">
                Streamlined Inventory Management System
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Yards Selection */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 relative">
        <h2 className="text-2xl font-bold text-white mb-8 text-center">
          Select Yard Location
        </h2>{" "}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 relative">
          {/* Peters Corner Yard */}
          <div
            onClick={() =>
              navigate("/inventory", { state: { yardName: "Peters Corner" } })
            }
            className="group relative rounded-lg overflow-hidden bg-slate-800 hover:bg-slate-700 transition-all duration-500 transform hover:-translate-y-1 hover:shadow-xl cursor-pointer"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/0 via-yellow-400/5 to-yellow-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="p-8 relative">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-semibold text-white group-hover:text-yellow-400 transition-colors">
                  Peters Corner
                </h3>
                <span className="text-yellow-400 transform group-hover:translate-x-2 transition-transform duration-300">
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
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </span>
              </div>
              <div className="mt-4 h-1 w-0 bg-yellow-400/50 transition-all duration-300 group-hover:w-full rounded-full" />
            </div>
          </div>

          {/* Hazel Yard */}
          <div
            onClick={() =>
              navigate("/inventory", { state: { yardName: "Hazel" } })
            }
            className="group relative rounded-lg overflow-hidden bg-slate-800 hover:bg-slate-700 transition-all duration-500 transform hover:-translate-y-1 hover:shadow-xl cursor-pointer"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/0 via-yellow-400/5 to-yellow-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="p-8 relative">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-semibold text-white group-hover:text-yellow-400 transition-colors">
                  Hazel
                </h3>
                <span className="text-yellow-400 transform group-hover:translate-x-2 transition-transform duration-300">
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
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </span>
              </div>
              <div className="mt-4 h-1 w-0 bg-yellow-400/50 transition-all duration-300 group-hover:w-full rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
