import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sales from "./pages/Sales"; // Ajuste o caminho se necessário

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Sales />} />
      </Routes>
    </Router>
  );
}

export default App;
