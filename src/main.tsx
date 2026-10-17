import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/index.css";
import App from "./App.tsx";
import { ThemeProvider } from "./context/ThemeProvider.tsx";
import { Provider } from "react-redux";
import { store } from "./store/store";

if (import.meta.env.DEV)
  (window as Window & { __flowBoardStore?: typeof store }).__flowBoardStore =
    store;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <Provider store={store}>
        <App />
      </Provider>
    </ThemeProvider>
  </StrictMode>,
);
