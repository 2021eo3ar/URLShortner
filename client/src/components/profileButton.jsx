import React, { useState } from 'react';
import { User, Link, LogOut, Home } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/authSlice';

const ProfileButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await dispatch(logout());
      // Redirect to the landing page after logout
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsOpen(false); // Close the dropdown when navigating
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 text-white hover:text-green-500 transition-colors"
      >
        <User className="h-6 w-6" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-gray-900 rounded-md shadow-lg py-1 border border-green-500/20">
          {/* Home Button (only if not on /home) */}
          {location.pathname !== '/home' && (
            <button
              onClick={() => handleNavigation('/home')}
              className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-black hover:text-green-500"
            >
              <Home className="h-4 w-4 mr-2" />
              Home Page
            </button>
          )}
          {/* Your Short URLs */}
          <a
            href="#"
            className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-black hover:text-green-500"
          >
            <Link className="h-4 w-4 mr-2" />
            Your Short URLs
          </a>
          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-black hover:text-green-500"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileButton;
