import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { LandingPage } from "./components/LandingPage";
import { InventoryCounter } from "./components/InventoryCounter";
import "./App.css";

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <div className="page-wrap">
      <AnimatePresence mode="sync" initial={false}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/yard/:yardId" element={<InventoryCounter />} />
        </Routes>
      </AnimatePresence>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AnimatedRoutes />
    </Router>
  );
}

export default App;
