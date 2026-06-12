import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiCheck, FiShoppingBag, FiTruck } from "react-icons/fi";

const OrderSuccessModal = ({ isOpen, onClose, orderDetails }) => {
  const navigate = useNavigate();

  // Disable scrolling on background when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Generate 25 confetti particles with random positions, colors, and delay
  const confettiColors = ["bg-red-400", "bg-yellow-400", "bg-blue-400", "bg-green-400", "bg-pink-400", "bg-purple-400"];
  const confettiParticles = Array.from({ length: 30 }).map((_, i) => {
    const left = `${Math.random() * 100}%`;
    const delay = `${Math.random() * 2}s`;
    const duration = `${1.5 + Math.random() * 2}s`;
    const size = Math.random() > 0.5 ? "w-2.5 h-2.5 rounded-full" : "w-2 h-3.5 rounded-sm";
    const color = confettiColors[Math.floor(Math.random() * confettiColors.length)];
    return { left, delay, duration, size, color, id: i };
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      {/* Confetti Container */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {confettiParticles.map((p) => (
          <div
            key={p.id}
            className={`absolute top-0 animate-confetti ${p.size} ${p.color}`}
            style={{
              left: p.left,
              animationDelay: p.delay,
              animationDuration: p.duration,
            }}
          />
        ))}
      </div>

      {/* Modal Card */}
      <div className="relative w-full max-w-lg overflow-hidden bg-white rounded-2xl shadow-2xl border border-gray-100 animate-scale-up">
        {/* Top Accent Gradient Line */}
        <div className="h-2 bg-gradient-to-r from-green-400 via-emerald-500 to-teal-600 w-full" />

        <div className="p-6 md:p-8 flex flex-col items-center text-center">
          {/* Animated SVG Checkmark Icon */}
          <div className="relative flex items-center justify-center w-24 h-24 mb-6 rounded-full bg-green-50 shadow-inner">
            <svg
              className="w-20 h-20 text-green-500"
              viewBox="0 0 52 52"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                className="success-checkmark-circle"
                cx="26"
                cy="26"
                r="25"
                stroke="#22c55e"
              />
              <path
                className="success-checkmark-check"
                d="M14.1 27.2l7.1 7.2 16.7-16.8"
                stroke="#22c55e"
              />
            </svg>
          </div>

          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">
            Order Placed!
          </h2>
          <p className="text-sm md:text-base text-gray-500 max-w-sm mb-6">
            Thank you for your purchase. Your order has been successfully processed and is on its way to you!
          </p>

          {/* Order Brief Summary */}
          {orderDetails && (
            <div className="w-full bg-gray-50 rounded-xl p-4 md:p-5 border border-gray-100 mb-6 text-left text-sm text-gray-600 grid gap-3">
              <div className="flex justify-between border-b border-gray-200/60 pb-2">
                <span className="font-semibold text-gray-800">Payment Mode:</span>
                <span className="font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded text-xs">
                  Cash on Delivery (COD)
                </span>
              </div>
              <div className="flex justify-between border-b border-gray-200/60 pb-2">
                <span className="font-semibold text-gray-800">Customer Name:</span>
                <span className="text-gray-700">{orderDetails.name}</span>
              </div>
              <div className="flex justify-between border-b border-gray-200/60 pb-2">
                <span className="font-semibold text-gray-800">Phone:</span>
                <span className="text-gray-700">{orderDetails.phone}</span>
              </div>
              <div className="flex justify-between border-b border-gray-200/60 pb-2">
                <span className="font-semibold text-gray-800">Deliver To:</span>
                <span className="text-gray-700 text-right truncate max-w-[200px]" title={`${orderDetails.address}, ${orderDetails.city}`}>
                  {orderDetails.address}, {orderDetails.city}
                </span>
              </div>
              <div className="flex justify-between pt-1 font-bold text-base text-gray-800">
                <span>Total Amount:</span>
                <span className="text-gray-900 font-extrabold">₹{orderDetails.totalPrice}</span>
              </div>
            </div>
          )}

          {/* Informational Shipping Card */}
          <div className="flex items-center gap-3 w-full bg-blue-50 border border-blue-100 rounded-xl p-3.5 text-left text-xs text-blue-700 mb-8">
            <FiTruck className="w-5 h-5 flex-shrink-0 animate-bounce" />
            <p className="font-medium">
              We'll send order updates and shipping confirmation details to <span className="font-bold underline">{orderDetails?.email || "your email"}</span>.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <button
              onClick={() => {
                onClose();
                navigate("/orders");
              }}
              className="flex-1 flex items-center justify-center gap-2 bg-gray-900 hover:bg-black text-white font-bold py-3 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <FiShoppingBag className="w-5 h-5" />
              View My Orders
            </button>
            <button
              onClick={() => {
                onClose();
                navigate("/");
              }}
              className="flex-1 flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-800 font-bold py-3 px-4 rounded-xl border border-gray-200 hover:border-gray-300 shadow-sm transition-all duration-200"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessModal;
