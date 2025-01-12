import React, { useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import LandingPage from './pages/LandingPage';
import HomePage from './pages/HomePage';
import CreatedUrls from './pages/CreatedUrls';
import { checkLoginStatus } from './redux/authSlice';
import Loader from './components/Loader';

const App = () => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);

  // Refresh token periodically
  useEffect(() => {
    if (!token) return;

    // Decode the token to find its expiration time
    const tokenData = JSON.parse(atob(token.split('.')[1]));
    const expirationTime = tokenData.exp * 1000; // Convert to milliseconds
    const timeToRefresh = expirationTime - Date.now() - 5 * 60 * 1000; // Refresh 5 minutes before expiry

    if (timeToRefresh > 0) {
      const timer = setTimeout(() => {
        dispatch(checkLoginStatus());
      }, timeToRefresh);

      return () => clearTimeout(timer); // Cleanup the timer
    }
  }, [token, dispatch]);

  // Check login status on app load
  useEffect(() => {
    dispatch(checkLoginStatus());
  }, [dispatch]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<PrivateRoute><HomePage /></PrivateRoute>} />
        <Route path="/created-urls" element={<PrivateRoute><CreatedUrls /></PrivateRoute>} />
      </Routes>
    </Router>
  );
};

const PrivateRoute = ({ children }) => {
  const { user, loading } = useSelector((state) => state.auth);

  if (loading) {
    return <Loader />;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default App;