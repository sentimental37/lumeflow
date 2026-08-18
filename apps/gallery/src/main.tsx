import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@sentimental37/visual-flow-react/styles.css";
import { App } from "./App.js";
import "./gallery.css";

createRoot(document.getElementById("root")!).render(<StrictMode><App /></StrictMode>);
