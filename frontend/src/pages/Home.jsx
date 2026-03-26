
import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../components/ProductCard";

const Home = () => {

  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await axios.get("http://localhost:5000/api/products");

      // show only first 3 as featured
      setProducts(res.data.slice(0, 3));
    };

    fetchProducts();
  }, []);

  return (
    <div className="flex flex-col items-center p-6">

      <h1 className="text-4xl font-bold mb-6">
        Featured Products
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>

    </div>
  );
};

export default Home;
