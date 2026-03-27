
import React, { useContext } from "react";
import { FaShoppingCart, FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import { StoreContext } from "../context/StoreContext";

const Navbar = () => {

  const { cartItems = [], user, setUser } = useContext(StoreContext);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <nav className="bg-blue-200 px-8 py-4 flex justify-between items-center">

      {/* Logo */}
      <Link to="/">
        <h1 className="text-2xl font-bold">
          Electronify
        </h1>
      </Link>

      {/* Links */}
      <div className="font-bold flex items-center gap-6">
        <Link to="/">Home</Link>
        <Link to="/collection">Shop</Link>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-6">

        <input
          type="text"
          placeholder="Search..."
          className="border px-2 py-1 rounded"
        />

        {/* Cart */}
        <Link to="/cart" className="relative">
          <FaShoppingCart size={22} />

          {cartItems.length > 0 && (
            <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs px-2 rounded-full">
              {cartItems.length}
            </span>
          )}
        </Link>

        {/* User Section */}
        {user ? (
          <div className="flex items-center gap-3">

            <span className="font-medium">
              {user.email}
            </span>

            <button
              onClick={handleLogout}
              className="text-red-500 text-sm"
            >
              Logout
            </button>

          </div>
        ) : (
          <Link to="/login">
            <FaUser size={22} />
          </Link>
        )}

      </div>

    </nav>
  );
};

export default Navbar;