import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Map from './components/Map';
import Active from './components/Active';
import History from './components/History';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/map" element={<Map />} />
        <Route path="/active" element={<Active />} />
        <Route path="/history" element={<History />} />
        <Route path="/" element={<Navigate replace to="/map" />} />
      </Routes>
    </Router>
  );
}

export default App;