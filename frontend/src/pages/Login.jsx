
import React, { useState, useContext } from "react";
import axios from "axios";
import { StoreContext } from "../context/StoreContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [role, setRole] = useState("Customer");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminCode, setAdminCode] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const { setUser, setToken } = useContext(StoreContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    try {
      if (isSignUp) {
        // Register user
        const res = await axios.post("http://localhost:5000/api/auth/register", {
          name,
          email,
          password,
          role,
          adminCode: role === "WarehouseAdmin" ? adminCode : undefined
        });

        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        setUser(res.data.user);
        setToken(res.data.token);
        navigate("/");
      } else {
        // Login user
        const res = await axios.post("http://localhost:5000/api/auth/login", {
          email,
          password,
          role
        });

        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        setUser(res.data.user);
        setToken(res.data.token);
        navigate("/");
      }
    } catch (error) {
      console.error(error);
      setErrorMsg(error.response?.data?.message || "Authentication failed");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-gray-200 shadow-md p-6 rounded-lg w-96">
        <h1 className="text-2xl font-bold mb-4 text-center">
          {isSignUp ? "Create Account" : "Sign In"}
        </h1>

        {errorMsg && (
          <div className="bg-red-100 text-red-700 p-2 rounded text-sm mb-3 text-center">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {/* Role Selection */}
          <div className="flex justify-around mb-2">
            <label className="flex items-center gap-2 cursor-pointer font-semibold">
              <input
                type="radio"
                name="role"
                value="Customer"
                checked={role === "Customer"}
                onChange={() => setRole("Customer")}
              />
              Customer
            </label>
            <label className="flex items-center gap-2 cursor-pointer font-semibold">
              <input
                type="radio"
                name="role"
                value="WarehouseAdmin"
                checked={role === "WarehouseAdmin"}
                onChange={() => setRole("WarehouseAdmin")}
              />
              Warehouse Admin
            </label>
          </div>

          {isSignUp && (
            <input
              type="text"
              placeholder="Full Name"
              className="border p-2 rounded bg-white"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          )}

          <input
            type="email"
            placeholder="Email"
            className="border p-2 rounded bg-white"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="border p-2 rounded bg-white"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {isSignUp && role === "WarehouseAdmin" && (
            <input
              type="password"
              placeholder="Warehouse Secret Admin Code"
              className="border p-2 rounded bg-white"
              value={adminCode}
              onChange={(e) => setAdminCode(e.target.value)}
              required
            />
          )}

          <button className="bg-red-400 text-white py-2 rounded hover:bg-red-500 font-bold transition">
            {isSignUp ? "Register" : "Login"}
          </button>
        </form>

        <p className="text-center text-sm mt-4 text-gray-700">
          {isSignUp ? "Already have an account? " : "New to Electronify? "}
          <span
            className="text-blue-600 cursor-pointer font-semibold underline"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setErrorMsg("");
            }}
          >
            {isSignUp ? "Sign In" : "Sign Up"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;