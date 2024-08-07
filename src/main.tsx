import * as React from "react";
import * as ReactDOM from "react-dom/client";
{
  /* import { createBrowserRouter, RouterProvider } from "react-router-dom"; */
}
import App from "./App.tsx";
import "./index.css";
import { PostProvider } from "./Context.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <PostProvider>
      <App />
    </PostProvider>
  </React.StrictMode>
);
