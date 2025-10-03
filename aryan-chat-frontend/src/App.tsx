import { Route, Routes } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/HomePage";

import ImagePage from "./pages/ImagePage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/image" element={<ImagePage/>} />

      
    </Routes>
  );
}

export default App;
