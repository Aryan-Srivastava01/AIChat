import { Route, Routes } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/HomePage";

import ImagePage from "./pages/ImagePage";
import Navbar from "@/components/navigation-menus/Navbar";

function App() {
  return (
    <div className="flex flex-col min-h-screen w-full items-between justify-center pt-20">
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/image" element={<ImagePage />} />
      </Routes>
    </div>
  );
}

export default App;
