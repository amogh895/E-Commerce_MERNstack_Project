import React, { useContext, useState } from "react";
import { FaStar, FaHeart, FaRegHeart } from "react-icons/fa";
import { StoreContext } from "../context/StoreContext";
import { Link } from "react-router-dom";
import AddToCartToast from "./AddToCartToast";

const ProductCard = ({ product }) => {
  const { addToCart, wishlist, toggleWishlist, user } =
    useContext(StoreContext);

  const isWishlisted = wishlist.some(
    (item) => item._id === product._id
  );

  const [showToast, setShowToast] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState("");

  const handleAddToCart = () => {
    addToCart(product);

    setSelectedProduct(product.name);
    setShowToast(true);

    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  return (
    <>
      <div className="bg-white shadow-md rounded-xl p-4 relative flex flex-col justify-between h-[360px]">
        {/* Wishlist Button (Customers Only) */}
        {user && user.role === "Customer" && (
          <button
            onClick={() => toggleWishlist(product)}
            className="absolute top-6 right-6 bg-white p-1.5 rounded-full shadow hover:scale-110 transition text-red-500 z-10"
          >
            {isWishlisted ? (
              <FaHeart size={18} />
            ) : (
              <FaRegHeart size={18} />
            )}
          </button>
        )}

        {/* Link to detail */}
        <Link
          to={`/product/${product._id}`}
          className="flex flex-col flex-grow"
        >
          {/* IMAGE */}
          <img
            src={product.image}
            alt={product.name}
            className="h-40 w-full object-cover rounded hover:opacity-90 transition"
          />

          {/* NAME */}
          <h2 className="text-md font-semibold mt-3 text-gray-800 line-clamp-2">
            {product.name}
          </h2>

          {/* RATING */}
          <div className="flex items-center gap-1 text-yellow-500 text-sm mt-1">
            <FaStar />
            <span>{product.rating || 0}</span>
          </div>

          {/* PRICE */}
          <p className="text-lg font-bold text-gray-900 mt-2">
            ₹{product.price}
          </p>
        </Link>

        {/* BUTTON */}
        {!user || user.role === "Customer" ? (
          product.stock > 0 ? (
            <button
              onClick={handleAddToCart}
              className="mt-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded text-sm w-full transition"
            >
              Add to Cart
            </button>
          ) : (
            <button
              disabled
              className="mt-3 bg-gray-300 text-gray-500 font-semibold py-2 rounded text-sm w-full cursor-not-allowed"
            >
              Out of Stock
            </button>
          )
        ) : (
          <div className="mt-3 text-center text-xs text-red-600 font-semibold bg-red-50 py-1 rounded">
            Admin View Only
          </div>
        )}
      </div>

      <AddToCartToast
        show={showToast}
        productName={selectedProduct}
      />
    </>
  );
};

export default ProductCard;