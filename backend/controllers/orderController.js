import Order from "../models/Order.js";
import Product from "../models/Product.js";

export const createOrder = async (req, res) => {
  const { products, totalPrice } = req.body;

  // Validate stock level without decrementing it immediately
  for (let item of products) {
    const product = await Product.findById(item.product);

    if (!product || product.stock < item.quantity) {
      return res.status(400).json({ msg: `Product ${product?.name || ""} is out of stock` });
    }
  }

  const order = await Order.create({
    user: req.user,
    products,
    totalPrice
  });

  res.json(order);
};

export const getOrders = async (req, res) => {
  try {
    let orders;
    if (req.userRole === "WarehouseAdmin") {
      orders = await Order.find().populate("products.product").populate("user", "name email");
    } else {
      orders = await Order.find({ user: req.user }).populate("products.product");
    }
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (req.userRole !== "WarehouseAdmin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Deduct stock if order is moving to Shipped for the first time
    if (status === "Shipped" && !order.stockDeducted) {
      for (let item of order.products) {
        const product = await Product.findById(item.product);
        if (product) {
          product.stock = Math.max(0, product.stock - item.quantity);
          await product.save();
        }
      }
      order.stockDeducted = true;
    }

    // Return stock back to inventory if a previously shipped order gets Cancelled
    if (status === "Cancelled" && order.stockDeducted) {
      for (let item of order.products) {
        const product = await Product.findById(item.product);
        if (product) {
          product.stock += item.quantity;
          await product.save();
        }
      }
      order.stockDeducted = false;
    }

    order.status = status;
    await order.save();
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};