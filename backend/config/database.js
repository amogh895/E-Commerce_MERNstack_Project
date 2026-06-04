import mongoose from "mongoose";
import Product from "../models/Product.js";
import Driver from "../models/Driver.js";

const initialProducts = [
  {
    name: "MacBook Pro 16-inch",
    description: "Apple M3 Pro chip with 12‑core CPU and 18‑core GPU, 18GB Unified Memory, 512GB SSD.",
    price: 249900,
    category: "Laptops",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&auto=format&fit=crop&q=60",
    stock: 12,
    rating: 4.8
  },
  {
    name: "Dell XPS 15",
    description: "Intel Core i9 13th Gen, NVIDIA RTX 4060, 32GB RAM, 1TB SSD, 15.6 inch OLED Touchscreen.",
    price: 199900,
    category: "Laptops",
    image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500&auto=format&fit=crop&q=60",
    stock: 8,
    rating: 4.6
  },
  {
    name: "iPhone 15 Pro Max",
    description: "A17 Pro chip, Titanium design, 48MP main camera, 256GB storage, Black Titanium.",
    price: 139900,
    category: "Mobiles",
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500&auto=format&fit=crop&q=60",
    stock: 25,
    rating: 4.9
  },
  {
    name: "Samsung Galaxy S24 Ultra",
    description: "Snapdragon 8 Gen 3, 200MP Camera, Galaxy AI, 12GB RAM, 256GB storage, S Pen included.",
    price: 129900,
    category: "Mobiles",
    image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500&auto=format&fit=crop&q=60",
    stock: 18,
    rating: 4.7
  },
  {
    name: "Sony WH-1000XM5",
    description: "Industry-leading noise canceling wireless headphones, 30-hour battery life, Multipoint connection.",
    price: 29900,
    category: "Audio",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60",
    stock: 30,
    rating: 4.7
  },
  {
    name: "Bose QuietComfort Ultra",
    description: "Spatial audio wireless earbuds with customtune technology and world-class noise cancellation.",
    price: 25900,
    category: "Audio",
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&auto=format&fit=crop&q=60",
    stock: 15,
    rating: 4.5
  },
  {
    name: "Keychron K2 Mechanical Keyboard",
    description: "Wireless mechanical keyboard with Gateron switches, RGB backlighting, Mac and Windows layout.",
    price: 8900,
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&auto=format&fit=crop&q=60",
    stock: 40,
    rating: 4.6
  },
  {
    name: "Logitech MX Master 3S",
    description: "Wireless performance mouse with 8K DPI tracking, ultra-quiet clicks, and MagSpeed scroll wheel.",
    price: 9900,
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500&auto=format&fit=crop&q=60",
    stock: 35,
    rating: 4.8
  },
  {
    name: "iPad Air 11-inch",
    description: "Apple M2 chip, 11-inch Liquid Retina Display, 128GB Storage, Wi-Fi 6E connectivity, Space Gray.",
    price: 59900,
    category: "Laptops",
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&auto=format&fit=crop&q=60",
    stock: 15,
    rating: 4.8
  },
  {
    name: "Apple Watch Series 9",
    description: "Always-On Retina display, S9 SiP chip, Double Tap gesture, Blood Oxygen app, Midnight Aluminum.",
    price: 41900,
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=500&auto=format&fit=crop&q=60",
    stock: 20,
    rating: 4.7
  },
  {
    name: "Sony HT-S20R Soundbar",
    description: "5.1 Channel Home Theatre System with Dolby Digital, Subwoofer and Compact Rear Speakers, 400W.",
    price: 17900,
    category: "Audio",
    image: "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=500&auto=format&fit=crop&q=60",
    stock: 10,
    rating: 4.5
  },
  {
    name: "ASUS RT-AX88U Router",
    description: "AX6000 Dual-Band Wi-Fi 6 Router, Lifetime Free Internet Security, 8 Gigabit LAN Ports.",
    price: 24900,
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&auto=format&fit=crop&q=60",
    stock: 14,
    rating: 4.6
  },
  {
    name: "Amazon Echo Dot (5th Gen)",
    description: "Smart speaker with Alexa, deeper bass, clearer vocals, and vibrant sound, Charcoal color.",
    price: 4900,
    category: "Audio",
    image: "https://images.unsplash.com/photo-1543512214-318c7553f230?w=500&auto=format&fit=crop&q=60",
    stock: 30,
    rating: 4.4
  },
  {
    name: "OnePlus 12R",
    description: "Snapdragon 8 Gen 2, 50MP Sony IMX890 Camera, 100W SUPERVOOC charging, 16GB RAM, Cool Blue.",
    price: 39900,
    category: "Mobiles",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&auto=format&fit=crop&q=60",
    stock: 22,
    rating: 4.7
  }
];

const initialDrivers = [
  { name: "John Doe", phone: "+1 555 0199", status: "Available" },
  { name: "Robert Smith", phone: "+1 555 0288", status: "Available" },
  { name: "Maria Garcia", phone: "+1 555 0377", status: "On Delivery" },
  { name: "James Wilson", phone: "+1 555 0466", status: "Offline" }
];

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Seed products if database is empty
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      await Product.insertMany(initialProducts);
      console.log("Database seeded with electronic products in Rupees.");
    }

    // Seed drivers if empty
    const driverCount = await Driver.countDocuments();
    if (driverCount === 0) {
      await Driver.insertMany(initialDrivers);
      console.log("Database seeded with default drivers.");
    }
  } catch (error) {
    console.error("Database connection error:", error.message);
    process.exit(1);
  }
};

export default connectDB;