
import React, { useContext, useState } from "react";
import { FaShoppingCart, FaUser, FaHeart, FaBars, FaTimes } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { StoreContext } from "../context/StoreContext";

const Navbar = () => {
  const { cartItems = [], wishlist = [], user, logout } = useContext(StoreContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/collection?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <nav className="bg-blue-200 px-6 py-4 relative shadow-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <h1 className="text-2xl font-bold text-gray-800">
            Electronify
          </h1>
        </Link>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center flex-1 max-w-sm mx-6">
          <input
            type="text"
            placeholder="Search electronic products..."
            className="border px-3 py-1.5 rounded-l w-full bg-white text-sm focus:outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" className="bg-blue-600 text-white px-4 py-1.5 rounded-r text-sm font-semibold hover:bg-blue-700">
            Search
          </button>
        </form>

        {/* Links & Options */}
        <div className="hidden md:flex items-center gap-6 font-bold text-gray-800">
          <Link to="/" className="hover:text-blue-700">Home</Link>
          <Link to="/collection" className="hover:text-blue-700">Shop</Link>
          <Link to="/about" className="hover:text-blue-700">About</Link>
          <Link to="/contact" className="hover:text-blue-700">Contact Us</Link>
          
          {user && user.role === "Customer" && (
            <Link to="/orders" className="hover:text-blue-700">My Orders</Link>
          )}

          {user && user.role === "WarehouseAdmin" && (
            <Link to="/admin" className="text-red-700 hover:text-red-900 font-extrabold bg-white px-2.5 py-1 rounded shadow-sm">
              Admin Panel
            </Link>
          )}
        </div>

        {/* Right Section Icons */}
        <div className="hidden md:flex items-center gap-6">
          {/* Wishlist */}
          {user && user.role === "Customer" && (
            <Link to="/collection?wishlist=true" className="relative text-gray-700 hover:text-red-600">
              <FaHeart size={20} />
              {wishlist.length > 0 && (
                <span className="absolute -top-2 -right-3 bg-red-600 text-white text-xs px-1.5 py-0.5 rounded-full font-bold">
                  {wishlist.length}
                </span>
              )}
            </Link>
          )}

          {/* Cart */}
          {(!user || user.role === "Customer") && (
            <Link to="/cart" className="relative text-gray-700 hover:text-blue-800">
              <FaShoppingCart size={22} />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                  {cartItems.length}
                </span>
              )}
            </Link>
          )}

          {/* User Profile */}
          {user ? (
            <div className="flex items-center gap-3">
              <div className="flex flex-col text-right">
                <span className="font-semibold text-sm text-gray-800 leading-tight">
                  {user.name}
                </span>
                <span className="text-xs text-gray-600">
                  {user.role === "WarehouseAdmin" ? "Warehouse Admin" : "Customer"}
                </span>
              </div>
              <button
                onClick={() => {
                  logout();
                  navigate("/login");
                }}
                className="text-red-600 text-sm font-bold hover:underline"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="text-gray-800 hover:text-blue-800 flex items-center gap-1 font-bold">
              <FaUser size={18} />
              <span>Login</span>
            </Link>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center gap-4">
          {/* Cart on mobile */}
          {(!user || user.role === "Customer") && (
            <Link to="/cart" className="relative text-gray-700">
              <FaShoppingCart size={22} />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs px-1.5 rounded-full font-bold">
                  {cartItems.length}
                </span>
              )}
            </Link>
          )}

          <button onClick={() => setMenuOpen(!menuOpen)} className="text-gray-800 focus:outline-none">
            {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-blue-100 mt-3 p-4 rounded-lg flex flex-col gap-3 font-bold text-gray-800 transition shadow-inner">
          <form onSubmit={handleSearchSubmit} className="flex items-center w-full">
            <input
              type="text"
              placeholder="Search products..."
              className="border px-3 py-1.5 rounded-l w-full bg-white text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" className="bg-blue-600 text-white px-3 py-1.5 rounded-r text-sm">
              Search
            </button>
          </form>

          <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/collection" onClick={() => setMenuOpen(false)}>Shop</Link>
          <Link to="/about" onClick={() => setMenuOpen(false)}>About</Link>
          <Link to="/contact" onClick={() => setMenuOpen(false)}>Contact Us</Link>
          
          {user && user.role === "Customer" && (
            <>
              <Link to="/orders" onClick={() => setMenuOpen(false)}>My Orders</Link>
              <Link to="/collection?wishlist=true" onClick={() => setMenuOpen(false)}>Wishlist ({wishlist.length})</Link>
            </>
          )}

          {user && user.role === "WarehouseAdmin" && (
            <Link to="/admin" onClick={() => setMenuOpen(false)} className="text-red-700">
              Admin Panel
            </Link>
          )}

          <div className="border-t border-blue-300 pt-2 flex flex-col gap-2">
            {user ? (
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-sm">{user.name}</div>
                  <div className="text-xs text-gray-600 font-normal">{user.role}</div>
                </div>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    logout();
                    navigate("/login");
                  }}
                  className="text-red-600 text-sm font-bold"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link to="/login" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 text-blue-700">
                <FaUser /> Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;