// Navbar.jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link2 } from 'lucide-react';
import { googleLogin, logout, setUser } from '../redux/authSlice';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  // Handle Google login or logout
  const handleAuthClick = async () => {
    if (user) {
      dispatch(logout()); // Dispatch logout action to clear the user state
    } else {
      // Dispatch the googleLogin action which will handle redirect and login logic
      dispatch(googleLogin());
    }
  };

  // Check the URL for the token and fetch user data after successful login
  useEffect(() => {
    const fetchUserData = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');

      if (token) {
        try {
          // Fetch user data using the token
          const response = await axios.get('http://localhost:5000/auth/user', {
            headers: { Authorization: `Bearer ${token}` },
          });

          // Dispatch action to store user data in Redux
          dispatch(setUser({ user: response.data.user, token }));

          // Redirect to HomePage
          navigate('/home');
        } catch (error) {
          console.error('Error fetching user data:', error.message);
        }
      }
    };

    fetchUserData();
  }, [dispatch, navigate]);

  return (
    <nav className="bg-black border-b border-green-500/20 px-4 py-3">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Link2 className="h-6 w-6 text-green-500" />
          <span className="text-green-500 font-bold text-xl">Shortify</span>
        </div>
        <button
          onClick={handleAuthClick}
          className="bg-green-500 hover:bg-green-600 text-black font-semibold px-4 py-2 rounded-md transition-colors"
        >
          {user ? 'Logout' : 'Login'}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;