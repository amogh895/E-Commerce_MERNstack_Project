
import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../components/ProductCard";

const Home = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/products");
        // show only first 3 as featured
        setProducts(res.data.slice(0, 3));
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="flex flex-col items-center p-6 bg-gray-50 min-h-screen">
      {/* Injecting CSS Keyframes for Enhanced Animations */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideWidth {
          from {
            width: 0%;
          }
          to {
            width: 60px;
          }
        }
        @keyframes subtlePulse {
          0%, 100% {
            transform: scale(1);
            text-shadow: 0 0 0px rgba(59, 130, 246, 0);
          }
          50% {
            transform: scale(1.02);
            text-shadow: 0 0 10px rgba(59, 130, 246, 0.2);
          }
        }
        .animate-title {
          opacity: 0;
          animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          animation-delay: 0.1s;
        }
        .animate-subtitle {
          opacity: 0;
          animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          animation-delay: 0.3s;
        }
        .animate-line {
          animation: slideWidth 0.6s ease-out forwards;
          animation-delay: 0.5s;
        }
        .pulse-logo {
          display: inline-block;
          animation: subtlePulse 3s infinite ease-in-out;
        }
        .product-cascade {
          opacity: 0;
          animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          animation-delay: 0.6s;
        }
      `}</style>

      {/* Enhanced Animated Welcome Section */}
      <div className="text-center my-10 max-w-2xl px-4 flex flex-col items-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-3 tracking-tight animate-title">
          Welcome to <span className="text-blue-600 pulse-logo">Electronify</span>
        </h1>
        {/* Animated Divider line */}
        <div className="h-1 bg-blue-500 rounded mb-4 animate-line" style={{ width: 0 }} />
        
        <p className="text-md md:text-lg text-gray-600 leading-relaxed font-medium animate-subtitle max-w-lg">
          Your premium hub for computers, smartphones, audio systems, and high-performance tech accessories.
        </p>
      </div>

      <div className="w-full max-w-6xl mt-6 product-cascade">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2 text-center md:text-left">
          Featured Products
        </h2>

        {products.length === 0 ? (
          <div className="text-center text-gray-500 py-10 font-semibold">Loading electronic catalog...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
