import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { LandingPage } from "./components/LandingPage";
import { InventoryPage } from "./components/InventoryPage";
import "./App.css";

function App() {
  return (
    <Router>
      <motion.div
        className="page-wrap"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/inventory" element={<InventoryPage />} />
          </Routes>
        </AnimatePresence>
      </motion.div>
    </Router>
  );
}

export default App;
