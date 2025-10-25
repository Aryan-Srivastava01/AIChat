import { createRoot } from "react-dom/client";
import "./index.css";
import ThemeProvider from "./components/providers/ThemeProvider.tsx";

createRoot(document.getElementById("root")!).render(<ThemeProvider />);
