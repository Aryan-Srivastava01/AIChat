import { Link, Route, Routes } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/HomePage";

import ImagePage from "./pages/ImagePage";
// import Navbar from "@/components/navigation-menus/Navbar";
import { Sidebar } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import AuthProvider from "./components/providers/AuthProvider";
import PracticePage from "./pages/PracticePage";
import PricingPage from "./pages/PricingPage";
import SignInPage from "./pages/SignInPage";
import FloatingNavBar from "@/components/navigation-menus/FloatingNavBar";

function App() {
  return (
    <div className="flex flex-col min-h-screen w-screen items-center justify-center overflow-hidden">
      <Sidebar className="hidden md:block" />
      <FloatingNavBar />
      {/* <Navbar /> */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/image"
          element={
            <AuthProvider>
              <ImagePage />
            </AuthProvider>
          }
        />
        <Route
          path="/practice"
          element={
            <AuthProvider>
              <PracticePage />
            </AuthProvider>
          }
        />
        <Route
          path="/pricing"
          element={
            <AuthProvider>
              <PricingPage />
            </AuthProvider>
          }
        />
        {/* sign in page is handled by clerk */}
        {/* <Route path="/sign-in" element={<SignInPage />} /> */}
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
