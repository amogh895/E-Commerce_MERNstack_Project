
import React, { useState, useContext } from "react";
import axios from "axios";
import { StoreContext } from "../context/StoreContext";
import { useNavigate } from "react-router-dom";

const Login = () => {

  const [email, setEmail] = useState("");
  const { setUser } = useContext(StoreContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email
      });

      // save token
      localStorage.setItem("token", res.data.token);

      // save user (IMPORTANT)
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // update context
      setUser(res.data.user);

      // redirect
      navigate("/");

    } catch (error) {
      console.error(error);
      alert("Login failed");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">

      <div className="bg-grey-300 shadow-md p-6 rounded-lg w-80">

        <h1 className="text-2xl font-bold mb-4 text-center">
          Login
        </h1>

        <form onSubmit={handleLogin} className="flex flex-col gap-3">

          <input
            type="email"
            placeholder="Email"
            className="border p-2 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button className="bg-red-400 text-white py-2 rounded">
            Login
          </button>

        </form>

      </div>

    </div>
  );
};

export default Login;