import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { googleLogin, logout, refreshAccessToken } from '../redux/authSlice';
import { useNavigate } from 'react-router-dom';
import ProfileButton from './ProfileButton';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, refreshToken, accessToken, loading } = useSelector((state) => state.auth);

  // Handler to trigger login or logout based on the user's authentication status
  const handleAuthClick = () => {
    if (user) {
      dispatch(logout());
      navigate('/');
    } else {
      dispatch(googleLogin()); // Dispatch the googleLogin thunk to start OAuth
    }
  };

  // Effect hook to handle user login from URL parameter after Google OAuth callback
  useEffect(() => {
    const fetchUserData = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token'); // Get token from query string
  
      if (token) {
        try {
          await dispatch(googleLogin(token)); // Use the token to dispatch login
          window.history.replaceState({}, '', window.location.pathname); // Clean up URL
          navigate('/home');
        } catch (error) {
          console.error('Error handling login:', error.message);
        }
      }
    };
  
    fetchUserData();
  }, [dispatch, navigate]);

  // Effect hook to refresh access token periodically
  useEffect(() => {
    if (user && refreshToken) {
      const interval = setInterval(() => {
        dispatch(refreshAccessToken());
      }, 15 * 60 * 1000); // Refresh every 15 minutes
  
      return () => clearInterval(interval);
    }
  }, [dispatch, user, refreshToken]);

  return (
    <nav className="bg-black border-b border-green-500/20 px-4 py-3">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <span className="text-green-500 font-bold text-xl">Shortify</span>
        </div>
        <div className="flex items-center space-x-4">
          {user ? (
            <ProfileButton />
          ) : (
            <button
              onClick={handleAuthClick}
              className="bg-green-500 hover:bg-green-600 text-black font-semibold px-4 py-2 rounded-md transition-colors"
              disabled={loading} // Disable the button while loading
            >
              {loading ? 'Logging in...' : 'Login'} {/* Show loading state */}
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
