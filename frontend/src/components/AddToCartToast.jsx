import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle } from "lucide-react";

const AddToCartToast = ({ show, productName }) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -20, x: 20 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, y: -20, x: 20 }}
          transition={{ duration: 0.3 }}
          className="fixed top-5 right-5 z-50"
        >
          <div className="bg-white shadow-2xl rounded-2xl px-5 py-4 border border-gray-200 flex items-center gap-3 min-w-[300px]">
            <CheckCircle className="text-green-500 w-8 h-8" />

            <div>
              <h3 className="font-semibold text-gray-800">
                Added to Cart
              </h3>

              <p className="text-sm text-gray-500">
                {productName} added successfully
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddToCartToast;