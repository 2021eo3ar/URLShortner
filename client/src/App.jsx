// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './App.css';
import LandingPage from './pages/LandingPage';
import HomePage from './pages/HomePage';

const App = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={user ? <HomePage /> : <LandingPage />} />
      </Routes>
    </Router>
  );
};

export default App;