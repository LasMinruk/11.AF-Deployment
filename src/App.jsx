// Import React and routing components
import React from "react";
import { Routes, Route } from "react-router-dom";

// Import page components
import Home from "./pages/Home";
import CountryDetail from "./pages/CountryDetail";
import Layout from "./components/Layout";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Favorites from "./pages/Favorites";
import LiveTimer from "./pages/LiveTimer";

// Main App component that handles routing
const App = () => {
  return (
    <Layout>
      <Routes>
        {/* Main routes for the application */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/country/:code" element={<CountryDetail />} />
        <Route path="/live-timer" element={<LiveTimer />} />
        {/* Catch-all route for 404 pages */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
};

export default App;
