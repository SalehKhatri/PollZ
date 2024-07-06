import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import CreatePoll from "./components/CreatePoll";
import "./App.css";
import SplashScreen from "./components/SplashScreen";
import ErrorPage from "./components/ErrorPage";
import PollPage from "./components/PollPage";

function App() {
  const [showSplash, setShowSplash] = useState<boolean>(true);
  const [showForm, setShowForm] = useState<boolean>(false);

  useEffect(() => {
    setTimeout(() => {
      setShowSplash(false);
    }, 1500); // Show splash screen in center for 1500 milliseconds
  }, []);

  useEffect(() => {
    if (!showSplash) {
      setShowForm(true);
    }
  }, [showSplash]);

  return (
    <>
      <Toaster position="bottom-right" reverseOrder={false} />
      <div className="relative h-screen w-full bg-slate-950">
        <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] "></div>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <SplashScreen showSplash={showSplash} />
                <motion.div
                  className="relative flex flex-col justify-center items-center max-w-[100%] max-h-[100%]"
                  initial={{
                    scale: showForm ? 1 : 0.2,
                    opacity: showForm ? 1 : 0,
                  }}
                  animate={{
                    scale: showForm ? 1 : 0,
                    opacity: showForm ? 1 : 0,
                  }}
                  transition={{
                    duration: 1.5,
                    delay: 0.5,
                    ease: "easeInOut",
                    type: "spring",
                    damping: "10",
                    stiffness: 30,
                  }}
                >
                  <CreatePoll />
                </motion.div>
              </>
            }
          />
          <Route
            path="/poll/:id"
            element={
              <>
                <SplashScreen showSplash={showSplash} />
                <motion.div
                  className="relative flex flex-col justify-center items-center max-w-[100%] max-h-[100%]"
                  initial={{
                    scale: showForm ? 1 : 0.2,
                    opacity: showForm ? 1 : 0,
                  }}
                  animate={{
                    scale: showForm ? 1 : 0,
                    opacity: showForm ? 1 : 0,
                  }}
                  transition={{
                    duration: 1.5,
                    delay: 0.5,
                    ease: "easeInOut",
                    type: "spring",
                    damping: "10",
                    stiffness: 30,
                  }}
                >
                  <PollPage />
                </motion.div>
              </>
            }
          />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
