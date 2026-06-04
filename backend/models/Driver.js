import mongoose from "mongoose";

const driverSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  status: { type: String, enum: ["Available", "On Delivery", "Offline"], default: "Available" }
}, { timestamps: true });

export default mongoose.model("Driver", driverSchema);
