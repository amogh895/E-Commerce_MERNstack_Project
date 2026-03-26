
import React, { useContext } from "react";
import { StoreContext } from "../context/StoreContext";
import { Link } from "react-router-dom";

const Cart = () => {

  const { cartItems, removeFromCart } = useContext(StoreContext);

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price,
    0
  );

  return (
    <div className="max-w-5xl mx-auto p-6">

      <h1 className="text-3xl font-bold mb-6">
        Your Cart
      </h1>

      {cartItems.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <>
          {cartItems.map((item) => (

            <div
              key={item._id}
              className="flex justify-between items-center border-b py-4"
            >

              <div className="flex items-center gap-4">

                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 rounded"
                />

                <div>
                  <h2 className="font-semibold">
                    {item.name}
                  </h2>

                  <p className="text-gray-600">
                    ${item.price}
                  </p>
                </div>

              </div>

              <button
                onClick={() => removeFromCart(item._id)}
                className="text-red-500"
              >
                Remove
              </button>

            </div>

          ))}

          {/* Total */}
          <div className="text-right mt-6">

            <h2 className="text-xl font-semibold">
              Total: ${totalPrice}
            </h2>

            <Link to="/checkout">
              <button className="bg-green-500 text-white px-4 py-2 mt-4 rounded">
                Go to Checkout
              </button>
            </Link>

          </div>
        </>
      )}

    </div>
  );
};

export default Cart;