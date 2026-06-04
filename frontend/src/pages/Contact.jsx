import React, { useState, useContext } from "react";
import axios from "axios";
import { StoreContext } from "../context/StoreContext";

import { API_URL } from "../config";

const Contact = () => {
  const { user } = useContext(StoreContext);
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccess(false);
    setSubmitting(true);

    try {
      await axios.post(`${API_URL}/api/queries`, {
        name,
        email,
        message
      });
      setSuccess(true);
      setMessage("");
    } catch (error) {
      console.error(error);
      setErrorMsg(error.response?.data?.message || "Failed to send message. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow-md rounded-xl border border-gray-200">
      <h1 className="text-3xl font-extrabold text-gray-800 mb-2 text-center">Contact Us</h1>
      <p className="text-sm text-gray-600 text-center mb-6">
        Have questions or support queries about our electronics? Send us a message and our Warehouse Team will review it.
      </p>

      {success && (
        <div className="bg-green-100 text-green-800 p-3 rounded-lg text-sm font-semibold mb-4 text-center">
          Message sent successfully! Our team will get back to you shortly.
        </div>
      )}

      {errorMsg && (
        <div className="bg-red-100 text-red-800 p-3 rounded-lg text-sm font-semibold mb-4 text-center">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="text-xs font-bold text-gray-600 block mb-1">Your Name</label>
          <input
            type="text"
            className="border p-2.5 rounded-lg w-full bg-white text-sm focus:outline-none"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="text-xs font-bold text-gray-600 block mb-1">Email Address</label>
          <input
            type="email"
            className="border p-2.5 rounded-lg w-full bg-white text-sm focus:outline-none"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="text-xs font-bold text-gray-600 block mb-1">Message / Query</label>
          <textarea
            className="border p-2.5 rounded-lg w-full bg-white text-sm focus:outline-none"
            placeholder="How can we help you?"
            rows="5"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-lg text-sm transition mt-2 disabled:opacity-50"
        >
          {submitting ? "Sending..." : "Send Message"}
        </button>
      </form>
    </div>
  );
};

export default Contact;
