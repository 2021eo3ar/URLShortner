import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { googleLogin, checkLoginStatus, logout } from "../redux/authSlice";
import ProfileButton from "./profileButton";
const Navbar = () => {
  const dispatch = useDispatch();
  const { user, status, error } = useSelector((state) => state.auth);

  useEffect(() => {
    // Check login status on component mount
    dispatch(checkLoginStatus()).unwrap()
      .then((response) => {
        // Save user data to localStorage
        if (response?.user) {
          localStorage.setItem("userData", JSON.stringify(response.user));
        }
      })
      .catch(() => {
        // Clear localStorage if validation fails
        localStorage.removeItem("userData");
      });
  }, [dispatch]);

  const handleLogin = () => {
    dispatch(googleLogin());
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <nav className="bg-black border-b border-green-500/20 px-4 py-3">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <span className="text-green-500 font-bold text-xl">Shortify</span>
        </div>
        <div className="flex items-center space-x-4">
          {user ? (
            <ProfileButton/>
          ) : (
            <button
              onClick={handleLogin}
              className="bg-green-500 hover:bg-green-600 text-black font-semibold px-4 py-2 rounded-md transition-colors"
              disabled={status === "loading"}
            >
              {status === "loading" ? "Logging in..." : "Login"}
            </button>
          )}
        </div>
      </div>
      {/* {error && <p className="text-red-500 text-sm">{error}</p>} */}
    </nav>
  );
};

export default Navbar;
