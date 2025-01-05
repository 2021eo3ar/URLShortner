import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { googleLogin, handleGoogleCallback, logout } from '../redux/authSlice';
import { useNavigate } from 'react-router-dom';
import ProfileButton from './profileButton';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // Check if user is present in localStorage
  useEffect(() => {
    const userData = localStorage.getItem('userData');
    if (userData) {
      setUser(JSON.parse(userData)); // Set the user state if userData exists
    }
  }, []);

  // Handle Google login or logout
  const handleAuthClick = () => {
    if (user) {
      dispatch(logout()); // Dispatch logout action to clear the user state
      localStorage.removeItem('userData'); // Clear userData from localStorage
      setUser(null); // Set user state to null after logout
    } else {
      dispatch(googleLogin()); // Redirect to Google login page
    }
  };

  // Check the URL for the token and fetch user data after successful login
  useEffect(() => {
    const fetchUserData = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');

      if (token) {
        try {
          // Dispatch action to handle the callback and store user/token in Redux
          dispatch(handleGoogleCallback(token));

          // Redirect to HomePage
          navigate('/home');
        } catch (error) {
          console.error('Error handling Google callback:', error.message);
        }
      }
    };

    fetchUserData();
  }, [dispatch, navigate]);

  return (
    <nav className="bg-black border-b border-green-500/20 px-4 py-3">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <span className="text-green-500 font-bold text-xl">Shortify</span>
        </div>
        <div className="flex items-center space-x-4">
          {user ? (
            <ProfileButton /> // Show ProfileButton when the user is logged in
          ) : (
            <button
              onClick={handleAuthClick}
              className="bg-green-500 hover:bg-green-600 text-black font-semibold px-4 py-2 rounded-md transition-colors"
            >
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
