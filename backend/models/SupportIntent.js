import mongoose from "mongoose";

const supportIntentSchema = new mongoose.Schema(
  {
    intent: { type: String, required: true, unique: true },
    response: { type: String, required: true },
    category: { type: String, required: true }
  },
  { timestamps: true }
);

export default mongoose.model("SupportIntent", supportIntentSchema);
