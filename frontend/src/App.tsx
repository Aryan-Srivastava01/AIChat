import { Route, Routes } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/HomePage";

import ImagePage from "./pages/ImagePage";
import Navbar from "@/components/navigation-menus/Navbar";
import { Toaster } from "@/components/ui/sonner";
import { Sidebar } from "@/components/ui/sidebar";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import LumaBar from "@/components/ui/futuristic-nav";

function App() {
  return (
    <div className="flex flex-col min-h-screen w-screen items-center justify-center overflow-hidden">
      <AnimatedThemeToggler className="fixed top-4 right-4 cursor-pointer z-50" />
      <Sidebar />
      <LumaBar />
      {/* <Navbar /> */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/image" element={<ImagePage />} />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
