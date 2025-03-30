import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ThemeProvider } from "./components/themeContext.jsx";
import { Toaster } from "react-hot-toast";

createRoot(document.getElementById("root")).render(
  <ThemeProvider>
    <App />
    <Toaster position="bottom-right" reverseOrder={false} />
  </ThemeProvider>
);
