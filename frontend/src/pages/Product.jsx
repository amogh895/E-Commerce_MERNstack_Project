import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { FaStar } from "react-icons/fa";
import { StoreContext } from "../context/StoreContext";

const Product = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const { addToCart, user } = useContext(StoreContext);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:5000/api/products/${id}`
        );
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();
  }, [id]);

  if (!product) {
    return <h1 className="text-center mt-10">Loading...</h1>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6 grid md:grid-cols-2 gap-10">
      {/* Image */}
      <img
        src={product.image}
        alt={product.name}
        className="rounded-xl shadow-lg"
      />

      {/* Info */}
      <div>
        <h1 className="text-3xl font-bold mb-3">
          {product.name}
        </h1>

        <p className="text-xl text-blue-600 font-semibold mb-2">
          ₹{product.price}
        </p>

        <div className="flex items-center gap-2 text-yellow-500 mb-4">
          <FaStar />
          <span>{product.rating}</span>
        </div>

        <p className="text-gray-600 mb-6 font-semibold">
          Stock status: {product.stock > 0 ? `${product.stock} items remaining` : <span className="text-red-600 font-bold">Out of Stock</span>}
        </p>

        <p className="text-gray-600 mb-6">
          {product.description}
        </p>

        {(!user || user.role === "Customer") ? (
          product.stock > 0 ? (
            <button
              onClick={() => addToCart(product)}
              className="bg-blue-500 text-white px-6 py-2.5 rounded-lg hover:bg-blue-600 font-bold transition"
            >
              Add to Cart
            </button>
          ) : (
            <button
              disabled
              className="bg-gray-300 text-gray-500 px-6 py-2.5 rounded-lg font-bold cursor-not-allowed"
            >
              Out of Stock
            </button>
          )
        ) : (
          <div className="text-red-600 font-bold bg-red-50 p-2 rounded w-fit text-sm">
            Admin View Only
          </div>
        )}
      </div>
    </div>
  );
};

export default Product;