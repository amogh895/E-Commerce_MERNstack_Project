import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle } from "lucide-react";

const OrderSuccessModal = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.6, opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="bg-white rounded-3xl p-8 shadow-2xl w-[90%] max-w-md text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="flex justify-center"
            >
              <CheckCircle className="text-green-500 w-20 h-20" />
            </motion.div>

            <h2 className="text-2xl font-bold mt-4 text-gray-800">
              Order Placed Successfully!
            </h2>

            <p className="text-gray-500 mt-2">
              Your order has been confirmed and will be delivered soon.
            </p>

            <button
              onClick={onClose}
              className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition"
            >
              Continue Shopping
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default OrderSuccessModal;