import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { googleLogin } from "../redux/authSlice";

const Navbar = () => {
  const dispatch = useDispatch();
  const { status, error } = useSelector((state) => state.auth);

  const handleLogin = () => {
    // Trigger the login action (no credentials needed from the UI)
    dispatch(googleLogin()).unwrap().then((response) => {
     console.log(response); ;
  });
};

  return (
    <nav className="bg-black border-b border-green-500/20 px-4 py-3">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <span className="text-green-500 font-bold text-xl">Shortify</span>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={handleLogin}
            className="bg-green-500 hover:bg-green-600 text-black font-semibold px-4 py-2 rounded-md transition-colors"
            disabled={status === "loading"}
          >
            {status === "loading" ? "Logging in..." : "Login"}
          </button>
        </div>
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </nav>
  );
};

export default Navbar;
