import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import PlansPage from "../pages/PlansPage";
import TakeoffPage from "../pages/TakeOffPage";
import HomePage from "../pages/HomePage";

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/plans" element={<PlansPage />} />
      <Route path="/takeoff" element={<TakeoffPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
      <Route path="/" element={<HomePage />} />
    </Routes>
  );
};

export default AppRoutes;
