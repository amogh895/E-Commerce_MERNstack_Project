import Order from "../models/Order.js";
import Product from "../models/Product.js";

export const createOrder = async (req, res) => {
  const { products, totalPrice } = req.body;


  for (let item of products) {
    const product = await Product.findById(item.product);

    if (!product || product.stock < item.quantity) {
      return res.status(400).json({ msg: "Out of stock" });
    }

    product.stock -= item.quantity;
    await product.save();
  }

  const order = await Order.create({
    user: req.user,
    products,
    totalPrice
  });

  res.json(order);
};

export const getOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user }).populate("products.product");
  res.json(orders);
};