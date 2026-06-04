import React, { useContext, useEffect, useState } from "react";
import { StoreContext } from "../context/StoreContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const { token, user } = useContext(StoreContext);
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [queries, setQueries] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [activeTab, setActiveTab] = useState("orders"); // 'orders', 'products', 'drivers', 'queries', 'customers'

  // Form states for creating a new product
  const [newName, setNewName] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newCat, setNewCat] = useState("Laptops");
  const [newImage, setNewImage] = useState("");
  const [newStock, setNewStock] = useState(10);

  // States for updating pricing/stock inline
  const [editingId, setEditingId] = useState(null);
  const [editPrice, setEditPrice] = useState("");
  const [editStock, setEditStock] = useState("");

  // Customer selection state for checking historical orders
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const categories = ["Laptops", "Mobiles", "Audio", "Accessories"];

  useEffect(() => {
    if (!token || user?.role !== "WarehouseAdmin") {
      return;
    }

    fetchData();
  }, [token, user]);

  const fetchData = async () => {
    try {
      const config = {
        headers: { Authorization: token }
      };

      const productsRes = await axios.get("http://localhost:5000/api/products");
      setProducts(productsRes.data);

      const ordersRes = await axios.get("http://localhost:5000/api/orders", config);
      const sortedOrders = ordersRes.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setOrders(sortedOrders);

      const driversRes = await axios.get("http://localhost:5000/api/drivers", config);
      setDrivers(driversRes.data);

      const queriesRes = await axios.get("http://localhost:5000/api/queries", config);
      setQueries(queriesRes.data);

      const customersRes = await axios.get("http://localhost:5000/api/auth/customers", config);
      setCustomers(customersRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Add a new product
  const handleCreateProduct = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: { Authorization: token }
      };

      await axios.post(
        "http://localhost:5000/api/products",
        {
          name: newName,
          price: Number(newPrice),
          description: newDesc,
          category: newCat,
          image: newImage,
          stock: Number(newStock)
        },
        config
      );

      alert("Product added successfully!");
      setNewName("");
      setNewPrice("");
      setNewDesc("");
      setNewImage("");
      setNewStock(10);
      fetchData();
    } catch (error) {
      console.error(error);
      alert("Failed to add product.");
    }
  };

  // Delete product
  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      const config = {
        headers: { Authorization: token }
      };
      await axios.delete(`http://localhost:5000/api/products/${id}`, config);
      alert("Product deleted!");
      fetchData();
    } catch (error) {
      console.error(error);
      alert("Failed to delete product.");
    }
  };

  // Start editing a product price/stock inline
  const startEditProduct = (prod) => {
    setEditingId(prod._id);
    setEditPrice(prod.price);
    setEditStock(prod.stock);
  };

  // Save edited product
  const handleSaveProduct = async (id) => {
    try {
      const config = {
        headers: { Authorization: token }
      };

      await axios.put(
        `http://localhost:5000/api/products/${id}`,
        {
          price: Number(editPrice),
          stock: Number(editStock)
        },
        config
      );

      setEditingId(null);
      alert("Product updated!");
      fetchData();
    } catch (error) {
      console.error(error);
      alert("Failed to update product.");
    }
  };

  // Update order status manually
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const config = {
        headers: { Authorization: token }
      };

      await axios.put(
        `http://localhost:5000/api/orders/${orderId}/status`,
        { status: newStatus },
        config
      );

      alert(`Order status upgraded to: ${newStatus}`);
      fetchData();
    } catch (error) {
      console.error(error);
      alert("Failed to update order status.");
    }
  };

  // Filter orders for selected customer
  const getCustomerOrders = (customerId) => {
    return orders.filter((order) => order.user?._id === customerId);
  };

  // Strict UI Gate: Customers/Guest users see Access Denied
  if (!token || user?.role !== "WarehouseAdmin") {
    return (
      <div className="max-w-md mx-auto mt-12 p-6 bg-red-50 border border-red-200 rounded-xl text-center shadow-md">
        <h2 className="text-2xl font-bold text-red-700 mb-2">Access Denied</h2>
        <p className="text-gray-700 mb-4">You do not have administrative privileges to access the Warehouse Portal.</p>
        <button
          onClick={() => navigate("/")}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-lg transition"
        >
          Return to Home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-6 gap-4 border-b pb-4">
        <h1 className="text-3xl font-extrabold text-gray-800">Warehouse Admin Panel</h1>
        <div className="flex flex-wrap bg-gray-200 p-1 rounded-lg gap-1">
          <button
            onClick={() => { setActiveTab("orders"); setSelectedCustomer(null); }}
            className={`px-3 py-1.5 rounded-md text-xs sm:text-sm font-bold transition ${
              activeTab === "orders" ? "bg-white text-gray-800 shadow" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Manage Orders ({orders.length})
          </button>
          <button
            onClick={() => { setActiveTab("products"); setSelectedCustomer(null); }}
            className={`px-3 py-1.5 rounded-md text-xs sm:text-sm font-bold transition ${
              activeTab === "products" ? "bg-white text-gray-800 shadow" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Configure Products ({products.length})
          </button>
          <button
            onClick={() => { setActiveTab("customers"); setSelectedCustomer(null); }}
            className={`px-3 py-1.5 rounded-md text-xs sm:text-sm font-bold transition ${
              activeTab === "customers" ? "bg-white text-gray-800 shadow" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Registered Customers ({customers.length})
          </button>
          <button
            onClick={() => { setActiveTab("drivers"); setSelectedCustomer(null); }}
            className={`px-3 py-1.5 rounded-md text-xs sm:text-sm font-bold transition ${
              activeTab === "drivers" ? "bg-white text-gray-800 shadow" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Delivery Drivers ({drivers.length})
          </button>
          <button
            onClick={() => { setActiveTab("queries"); setSelectedCustomer(null); }}
            className={`px-3 py-1.5 rounded-md text-xs sm:text-sm font-bold transition ${
              activeTab === "queries" ? "bg-white text-gray-800 shadow" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Customer Queries ({queries.length})
          </button>
        </div>
      </div>

      {/* Tab: Orders Management */}
      {activeTab === "orders" && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-gray-700">Customer Orders (COD Only)</h2>
          {orders.length === 0 ? (
            <p className="bg-gray-100 p-6 rounded-lg text-center text-gray-500 font-semibold">No orders in system.</p>
          ) : (
            <div className="overflow-x-auto border rounded-xl shadow-sm bg-white">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-3">Order Details</th>
                    <th className="px-6 py-3">Customer Info</th>
                    <th className="px-6 py-3">Items Purchased</th>
                    <th className="px-6 py-3">Total Value</th>
                    <th className="px-6 py-3">Update Tracking Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-sm">
                  {orders.map((order) => (
                    <tr key={order._id}>
                      <td className="px-6 py-4">
                        <span className="font-semibold block text-gray-900 truncate max-w-[120px]" title={order._id}>
                          {order._id}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-gray-800 block">
                          {order.user?.name || "Deleted User"}
                        </span>
                        <span className="text-xs text-gray-500 block">{order.user?.email}</span>
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-700">
                        {order.products.map((item, idx) => (
                          <div key={idx} className="mb-1">
                            • <strong>{item.product?.name || "Removed Item"}</strong> (Qty: {item.quantity})
                          </div>
                        ))}
                      </td>
                      <td className="px-6 py-4 font-bold text-gray-900">₹{order.totalPrice}</td>
                      <td className="px-6 py-4">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          className="border p-2 rounded-lg text-xs font-semibold text-gray-700 bg-gray-50 focus:outline-none"
                        >
                          <option value="Placed">Placed</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Out for Delivery">Out for Delivery</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab: Products Management */}
      {activeTab === "products" && (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="bg-gray-50 p-6 rounded-xl border h-fit shadow-sm">
            <h3 className="text-lg font-bold mb-4 text-gray-800">Add Electronic Product</h3>
            <form onSubmit={handleCreateProduct} className="grid gap-3">
              <input
                type="text"
                placeholder="Product Name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                required
                className="border p-2 rounded text-sm bg-white"
              />
              <textarea
                placeholder="Product Description"
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                required
                rows="3"
                className="border p-2 rounded text-sm bg-white"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  placeholder="Price (₹)"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  required
                  min="0"
                  className="border p-2 rounded text-sm bg-white"
                />
                <input
                  type="number"
                  placeholder="Initial Stock"
                  value={newStock}
                  onChange={(e) => setNewStock(e.target.value)}
                  required
                  min="0"
                  className="border p-2 rounded text-sm bg-white"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 block mb-1">Category</label>
                <select
                  value={newCat}
                  onChange={(e) => setNewCat(e.target.value)}
                  className="border p-2 rounded w-full text-sm bg-white"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <input
                type="url"
                placeholder="Image URL"
                value={newImage}
                onChange={(e) => setNewImage(e.target.value)}
                required
                className="border p-2 rounded text-sm bg-white"
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded text-sm mt-2 transition"
              >
                Add Electronic Product
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-lg font-bold text-gray-800">Electronic Catalog Configuration</h3>
            <div className="overflow-x-auto border rounded-xl shadow-sm bg-white">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-3">Product Info</th>
                    <th className="px-6 py-3">Category</th>
                    <th className="px-6 py-3">Price (₹)</th>
                    <th className="px-6 py-3">Stock Count</th>
                    <th className="px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-sm">
                  {products.map((prod) => (
                    <tr key={prod._id}>
                      <td className="px-6 py-4 flex items-center gap-3">
                        <img src={prod.image} alt={prod.name} className="w-10 h-10 object-cover rounded border" />
                        <span className="font-semibold text-gray-900 block truncate max-w-[150px]">{prod.name}</span>
                      </td>
                      <td className="px-6 py-4 text-gray-600 font-medium">{prod.category}</td>
                      <td className="px-6 py-4">
                        {editingId === prod._id ? (
                          <input
                            type="number"
                            value={editPrice}
                            onChange={(e) => setEditPrice(e.target.value)}
                            className="border p-1.5 rounded w-20 text-sm"
                            min="0"
                          />
                        ) : (
                          <span className="font-bold text-gray-800">₹{prod.price}</span>
                        )}
                      </td>
                      <td className="px-6 py-4 font-semibold text-gray-700">
                        {editingId === prod._id ? (
                          <input
                            type="number"
                            value={editStock}
                            onChange={(e) => setEditStock(e.target.value)}
                            className="border p-1.5 rounded w-16 text-sm"
                            min="0"
                          />
                        ) : (
                          <span>{prod.stock} items</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {editingId === prod._id ? (
                          <div className="flex gap-2 justify-end">
                            <button
                              onClick={() => handleSaveProduct(prod._id)}
                              className="text-green-600 font-bold hover:underline"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="text-gray-500 font-bold hover:underline"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div className="flex gap-3 justify-end">
                            <button
                              onClick={() => startEditProduct(prod)}
                              className="text-blue-600 hover:text-blue-800 font-semibold"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(prod._id)}
                              className="text-red-500 hover:text-red-700 font-semibold"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Registered Customers & Previous Orders Directory */}
      {activeTab === "customers" && (
        <div className="grid md:grid-cols-3 gap-6">
          {/* Customer Directory List */}
          <div className="md:col-span-1 bg-white border rounded-xl p-4 shadow-sm h-[500px] overflow-y-auto">
            <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Customer List</h3>
            {customers.length === 0 ? (
              <p className="text-gray-500 font-semibold text-center py-6">No customers registered yet.</p>
            ) : (
              <div className="space-y-2">
                {customers.map((c) => (
                  <div
                    key={c._id}
                    onClick={() => setSelectedCustomer(c)}
                    className={`p-3 rounded-lg border cursor-pointer transition ${
                      selectedCustomer?._id === c._id
                        ? "bg-blue-50 border-blue-300 shadow-sm"
                        : "hover:bg-gray-50 border-gray-200"
                    }`}
                  >
                    <h4 className="font-bold text-gray-800">{c.name}</h4>
                    <p className="text-xs text-gray-500">{c.email}</p>
                    <p className="text-[10px] text-gray-400 mt-1">Joined: {new Date(c.createdAt || Date.now()).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Customer Historical Orders Display */}
          <div className="md:col-span-2 bg-white border rounded-xl p-5 shadow-sm h-[500px] overflow-y-auto flex flex-col">
            {selectedCustomer ? (
              <div>
                <div className="border-b pb-3 mb-4 flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-extrabold text-gray-800">{selectedCustomer.name}'s Orders</h3>
                    <p className="text-sm text-gray-500">{selectedCustomer.email}</p>
                  </div>
                  <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full">
                    Total Orders: {getCustomerOrders(selectedCustomer._id).length}
                  </span>
                </div>

                {getCustomerOrders(selectedCustomer._id).length === 0 ? (
                  <div className="text-center py-12 text-gray-500 font-semibold bg-gray-50 rounded-lg">
                    This customer has not placed any orders yet.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {getCustomerOrders(selectedCustomer._id).map((order) => (
                      <div key={order._id} className="border rounded-lg p-4 bg-gray-50 shadow-sm">
                        <div className="flex justify-between items-center border-b pb-2 mb-2 text-xs">
                          <span className="text-gray-500 font-bold">ORDER ID: {order._id}</span>
                          <span className="text-gray-400">Date: {new Date(order.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="space-y-1.5 my-2">
                          {order.products.map((item, index) => (
                            <div key={index} className="flex justify-between text-sm text-gray-700">
                              <span>• {item.product?.name || "Removed Item"} (Qty: {item.quantity})</span>
                              <span className="font-semibold text-gray-900">₹{item.product?.price || 0}</span>
                            </div>
                          ))}
                        </div>
                        <div className="border-t pt-2 flex justify-between items-center mt-2">
                          <span className="text-xs">
                            Status: <strong className="text-blue-600">{order.status}</strong>
                          </span>
                          <span className="text-sm font-extrabold text-gray-900">Total: ₹{order.totalPrice}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex-grow flex flex-col items-center justify-center text-center text-gray-500 p-6 bg-gray-50 rounded-lg">
                <p className="font-bold text-lg mb-1">Select a customer</p>
                <p className="text-sm">Click on any customer from the directory to inspect their profile and order history.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab: Drivers Management */}
      {activeTab === "drivers" && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-gray-700">Available Delivery Drivers</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {drivers.map((driver) => (
              <div key={driver._id} className="bg-white border p-4 rounded-xl shadow-sm flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-gray-800 text-lg">{driver.name}</h4>
                  <p className="text-sm text-gray-500 mb-3">{driver.phone}</p>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs font-bold text-gray-500">STATUS</span>
                  <span
                    className={`px-2.5 py-0.5 rounded text-xs font-bold ${
                      driver.status === "Available"
                        ? "bg-green-100 text-green-800"
                        : driver.status === "On Delivery"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {driver.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Customer Queries */}
      {activeTab === "queries" && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-gray-700">Customer Messages & Support Queries</h2>
          {queries.length === 0 ? (
            <p className="bg-gray-100 p-6 rounded-lg text-center text-gray-500 font-semibold">No queries received.</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {queries.map((q) => (
                <div key={q._id} className="bg-white border rounded-xl p-5 shadow-sm relative flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start border-b pb-3 mb-3">
                      <div>
                        <h4 className="font-bold text-gray-800">{q.name}</h4>
                        <a href={`mailto:${q.email}`} className="text-xs text-blue-600 hover:underline">{q.email}</a>
                      </div>
                      <span className="text-[10px] text-gray-400">
                        {new Date(q.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">{q.message}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t flex justify-end">
                    <a
                      href={`mailto:${q.email}?subject=Regarding Your Electronify Support Ticket`}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-3 py-1.5 rounded transition shadow-sm"
                    >
                      Reply to Email
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
