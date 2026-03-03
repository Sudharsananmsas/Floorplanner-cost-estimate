import React from "react";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import NavBar from "./components/NavBar";

const App: React.FC = () => {
  return (
    <BrowserRouter>
    <NavBar />
      <main className="app-container">
        <AppRoutes />
      </main>
    </BrowserRouter>
  );
};

export default App;
