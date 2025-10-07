import { Route, Routes } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/HomePage";

import ImagePage from "./pages/ImagePage";
import Navbar from "@/components/navigation-menus/Navbar";
import { Toaster } from "@/components/ui/sonner";
import { SessionNavBar } from "@/components/ui/sidebar";

function App() {
  return (
    <div className="flex flex-col min-h-screen max-h-screen w-screen items-center justify-center overflow-hidden">
      <SessionNavBar />
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/image" element={<ImagePage />} />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
