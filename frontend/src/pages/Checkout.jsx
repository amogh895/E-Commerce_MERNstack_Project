
import React, { useContext, useState } from "react";
import { StoreContext } from "../context/StoreContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../config";

const Checkout = () => {
  const { cartItems, clearCart, token, user } = useContext(StoreContext);
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const navigate = useNavigate();

  const totalPrice = cartItems.reduce((total, item) => total + item.price, 0);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!token) {
      setErrorMsg("Please log in to place an order.");
      return;
    }

    if (cartItems.length === 0) {
      setErrorMsg("Your cart is empty.");
      return;
    }

    setLoading(true);

    try {
      // Map cartItems to matching order products schema format
      const productsData = cartItems.map((item) => ({
        product: item._id,
        quantity: 1 // Single quantity for now based on cart design
      }));

      const config = {
        headers: {
          Authorization: token
        }
      };

      await axios.post(
        `${API_URL}/api/orders`,
        {
          products: productsData,
          totalPrice
        },
        config
      );

      clearCart();
      alert("Order Placed Successfully via Cash on Delivery!");
      navigate("/orders");
    } catch (error) {
      console.error(error);
      setErrorMsg(error.response?.data?.msg || "Failed to place order.");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-yellow-50 rounded-lg text-center shadow">
        <h2 className="text-xl font-bold mb-2">Access Denied</h2>
        <p className="text-gray-600 mb-4">You must be logged in as a customer to access checkout.</p>
        <button
          onClick={() => navigate("/login")}
          className="bg-blue-600 text-white px-4 py-2 rounded font-semibold hover:bg-blue-700"
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 grid md:grid-cols-3 gap-6">
      {/* Checkout Form */}
      <div className="md:col-span-2 bg-gray-50 p-6 rounded-lg shadow-sm border">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          Delivery Details
        </h1>

        {errorMsg && (
          <div className="bg-red-100 text-red-700 p-2.5 rounded text-sm mb-4">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handlePlaceOrder} className="grid gap-4">
          <input
            type="text"
            placeholder="Full Name"
            className="border p-2 rounded bg-white text-sm"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            type="email"
            placeholder="Email Address"
            className="border p-2 rounded bg-white text-sm"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Shipping Address"
            className="border p-2 rounded bg-white text-sm"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="City"
              className="border p-2 rounded bg-white text-sm"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            />

            <input
              type="text"
              placeholder="Postal Code"
              className="border p-2 rounded bg-white text-sm"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              required
            />
          </div>

          <input
            type="text"
            placeholder="Phone Number"
            className="border p-2 rounded bg-white text-sm"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />

          <div className="bg-blue-50 text-blue-800 p-3 rounded text-xs font-semibold mt-2">
            Payment Method: Cash on Delivery (COD) only.
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2.5 rounded mt-3 transition disabled:opacity-50"
          >
            {loading ? "Placing Order..." : "Confirm & Place Order"}
          </button>
        </form>
      </div>

      {/* Cart Summary */}
      <div className="bg-gray-100 p-6 rounded-lg border h-fit">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Order Summary</h2>
        <div className="divide-y divide-gray-200">
          {cartItems.map((item) => (
            <div key={item._id} className="py-2.5 flex justify-between text-sm">
              <span className="text-gray-700 truncate max-w-[150px]">{item.name}</span>
              <span className="font-semibold text-gray-900">₹{item.price}</span>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-300 mt-4 pt-4 flex justify-between font-bold text-lg text-gray-900">
          <span>Total:</span>
          <span>₹{totalPrice}</span>
        </div>
      </div>
    </div>
  );
};

export default Checkout;