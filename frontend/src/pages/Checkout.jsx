
import React from "react";

const Checkout = () => {

  return (
    <div className="max-w-4xl mx-auto p-6">

      <h1 className="text-3xl font-bold mb-6">
        Checkout
      </h1>

      <form className="grid gap-4">

        <input
          type="text"
          placeholder="Full Name"
          className="border p-2 rounded"
        />

        <input
          type="email"
          placeholder="Email Address"
          className="border p-2 rounded"
        />

        <input
          type="text"
          placeholder="Address"
          className="border p-2 rounded"
        />

        <input
          type="text"
          placeholder="City"
          className="border p-2 rounded"
        />

        <input
          type="text"
          placeholder="Postal Code"
          className="border p-2 rounded"
        />

        <button className="bg-green-500 text-white py-2 rounded mt-3">
          Place Order
        </button>

      </form>

    </div>
  );
};

export default Checkout;