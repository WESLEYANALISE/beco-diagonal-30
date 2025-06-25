
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { registerServiceWorker } from "./utils/serviceWorker";
import { preloadFonts, optimizeFontLoading } from "./utils/fontOptimization";
import { bundleAnalyzer } from "./utils/bundleAnalyzer";

// Initialize performance monitoring
bundleAnalyzer.startTracking();

// Optimize font loading
preloadFonts();
optimizeFontLoading();

// Register service worker for caching
registerServiceWorker();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

// Log bundle analysis in development
setTimeout(() => {
  bundleAnalyzer.logReport();
}, 3000);
