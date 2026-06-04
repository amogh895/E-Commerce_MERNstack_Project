
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import ProductCard from "../components/ProductCard";
import { StoreContext } from "../context/StoreContext";
import { useLocation } from "react-router-dom";

import { API_URL } from "../config";

const Collection = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const { wishlist, user } = useContext(StoreContext);
  const location = useLocation();

  // Categories list
  const categories = ["All", "Laptops", "Mobiles", "Audio", "Accessories"];

  // Fetch from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/products`);
        setProducts(res.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  // Sync search and wishlist from URL query params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchParam = params.get("search");
    if (searchParam) {
      setSearch(searchParam);
    } else {
      setSearch("");
    }
  }, [location.search]);

  // Determine if we should only display wishlist items
  const params = new URLSearchParams(location.search);
  const showWishlistOnly = params.get("wishlist") === "true";

  // Filter products by category, search term, and wishlist
  let filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase());
    const matchesWishlist = !showWishlistOnly || wishlist.some((item) => item._id === product._id);
    return matchesCategory && matchesSearch && matchesWishlist;
  });

  // Sorting
  if (sort === "low") {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sort === "high") {
    filteredProducts.sort((a, b) => b.price - a.price);
  } else if (sort === "rating") {
    filteredProducts.sort((a, b) => b.rating - a.rating);
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        {showWishlistOnly ? "My Wishlist" : "Shop Electronic Products"}
      </h1>

      {/* Categories Tabs & Filters */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-8 bg-gray-100 p-4 rounded-xl shadow-sm border border-gray-200">
        {/* Category selector */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition ${
                selectedCategory === cat
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-white text-gray-700 hover:bg-gray-200 border border-gray-300"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Filters and Sorting */}
        <div className="flex gap-3 w-full md:w-auto">
          <input
            type="text"
            placeholder="Search within shop..."
            className="border p-2 rounded-lg text-sm bg-white flex-grow md:flex-grow-0"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="border p-2 rounded-lg text-sm bg-white font-semibold text-gray-700"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="">Sort By</option>
            <option value="low">Price Low → High</option>
            <option value="high">Price High → Low</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12 text-gray-600 font-semibold bg-gray-100 rounded-xl">
          No electronic products found matching your filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Collection;