import { Link, Route, Routes } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/HomePage";

import ImagePage from "./pages/ImagePage";
// import Navbar from "@/components/navigation-menus/Navbar";
import { SideBar } from "@/components/sidebars/SideBar";
import { Toaster } from "@/components/ui/sonner";
import AuthProvider from "./components/providers/AuthProvider";
import PracticePage from "./pages/PracticePage";
import PricingPage from "./pages/PricingPage";
import SignInPage from "./pages/SignInPage";
import FloatingNavBar from "@/components/navigation-menus/FloatingNavBar";
import AppBuilderPage from "./pages/AppBuilderPage";
import CodeGenPage from "./pages/CodeGenPage";
import { useEffect, useState } from "react";
import { WebContainer } from "@webcontainer/api";
import AppBuilderPageV2 from "./pages/AppBuilderPageV2";

function App() {
  const [webContainer, setWebContainer] = useState<WebContainer | null>(null);

  // Booting web container instance
  useEffect(() => {
    const bootWebContainer = async () => {
      const webcontainerInstance = await WebContainer.boot();
      setWebContainer(webcontainerInstance);
    };
    bootWebContainer();
  }, []);

  return (
    <div className="flex flex-col min-h-screen w-screen items-center justify-center overflow-hidden">
      <SideBar className="hidden md:block" />
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
        {/* <Route
          path="/app-builder"
          element={
            <AuthProvider>
              <AppBuilderPage webContainer={webContainer} />
            </AuthProvider>
          }
        /> */}
        {/* <Route
          path="/code-gen"
          element={
            <AuthProvider>
              <CodeGenPage />
            </AuthProvider>
          }
        /> */}
        <Route
          path="/app-builder-v2"
          element={
            <AuthProvider>
              <AppBuilderPageV2 webContainer={webContainer} />
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
