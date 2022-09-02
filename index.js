import React from 'react';
import ReactDOM from "react-dom/client";
import { 
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import App from "./App";
import Game from "./Game/Game";

const root = ReactDOM.createRoot(
  document.getElementById("root")
);
root.render(
  <BrowserRouter>
  <Routes>
    <Route path="/" element={<App />}>
      <Route path="/Game" element={<Game />} />
      <Route
        path="*"
        element={
          <main style={{ padding: "1rem" }}>
            <p>There's nothing here!</p>
          </main>
        }
      />
    </Route>
  </Routes>
  </BrowserRouter>
);