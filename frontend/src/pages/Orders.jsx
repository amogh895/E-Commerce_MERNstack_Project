import React, { useContext, useEffect, useState } from "react";
import { StoreContext } from "../context/StoreContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Orders = () => {
  const { token, user } = useContext(StoreContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchOrders = async () => {
      try {
        const config = {
          headers: {
            Authorization: token
          }
        };
        const res = await axios.get("http://localhost:5000/api/orders", config);
        // Sort orders so the newest are first
        const sortedOrders = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setOrders(sortedOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token, navigate]);

  const getStatusColor = (status) => {
    switch (status) {
      case "Placed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Shipped":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Out for Delivery":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "Delivered":
        return "bg-green-100 text-green-800 border-green-200";
      case "Cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (loading) {
    return <div className="text-center mt-12 font-semibold">Loading your orders...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">My Orders</h1>

      {orders.length === 0 ? (
        <div className="bg-gray-100 p-8 rounded-lg text-center text-gray-600 font-medium">
          You haven't placed any electronic orders yet.
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="bg-white border rounded-xl shadow-sm overflow-hidden">
              {/* Order Header */}
              <div className="bg-gray-50 p-4 border-b flex flex-wrap justify-between items-center gap-2">
                <div>
                  <p className="text-xs text-gray-500 font-bold">ORDER ID</p>
                  <p className="text-sm font-semibold text-gray-700">{order._id}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-bold">DATE PLACED</p>
                  <p className="text-sm font-semibold text-gray-700">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-bold">TOTAL PRICE</p>
                  <p className="text-sm font-extrabold text-gray-900">₹{order.totalPrice}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-bold mb-1">TRACKING STATUS</p>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>
              </div>

              {/* Order Items */}
              <div className="p-4 divide-y divide-gray-100">
                {order.products.map((item) => (
                  <div key={item._id || item.product?._id} className="py-3 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {item.product?.image && (
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-16 h-16 object-cover rounded border"
                        />
                      )}
                      <div>
                        <h4 className="font-semibold text-gray-800 text-sm">
                          {item.product?.name || "Product details unavailable"}
                        </h4>
                        <p className="text-xs text-gray-500">Category: {item.product?.category}</p>
                        <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">₹{item.product?.price || 0}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Tracking Timeline */}
              <div className="bg-blue-50/50 p-4 border-t text-xs text-gray-600 flex justify-between items-center">
                <span>Payment Method: <strong>Cash on Delivery (COD)</strong></span>
                <span>Estimated delivery: <strong>3-5 business days</strong></span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
