
import React, { useContext } from "react";
import { FaStar } from "react-icons/fa";
import { StoreContext } from "../context/StoreContext";

const ProductCard = ({ product }) => {

  const { addToCart } = useContext(StoreContext);

  return (
    <div className="bg-white shadow-md rounded-xl p-4">

      {/* IMAGE */}
      <img
        src={product.image}
        alt={product.name}
        className="h-48 w-full object-cover rounded"
      />

      {/* NAME */}
      <h2 className="text-lg font-semibold mt-3">
        {product.name}
      </h2>

      {/* PRICE */}
      <p className="text-gray-600">${product.price}</p>

      {/* RATING */}
      <div className="flex items-center gap-1 text-yellow-500">
        <FaStar />
        {product.rating || 0}
      </div>

      {/* BUTTON */}
      <button
        onClick={() => addToCart(product)}
        className="mt-3 bg-blue-500 text-white px-4 py-2 rounded"
      >
        Add to Cart
      </button>

    </div>
  );
};

export default ProductCard;