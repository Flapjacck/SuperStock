import { motion } from "framer-motion";
import { LandingPage } from "./components/LandingPage";
import "./App.css";

function App() {
  return (
    <motion.div
      className="page-wrap"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <LandingPage />
    </motion.div>
  );
}

export default App;
