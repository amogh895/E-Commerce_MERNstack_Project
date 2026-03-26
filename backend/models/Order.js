import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  products: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      quantity: Number
    }
  ],
  totalPrice: Number,
  status: { type: String, default: "Placed" }
}, { timestamps: true });

export default mongoose.model("Order", orderSchema);