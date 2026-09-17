import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import Product from "../models/Product.js";
import User from "../models/User.js";
import { connectDB } from "../config/db.js";

dotenv.config();

const TECH_PRODUCTS = [
  {
    name: "Premium Wireless Headphones",
    price: 299.99,
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=60",
    category: "Electronics",
    stock: 15,
  },
  {
    name: "Mechanical Gaming Keyboard",
    price: 159.99,
    image:
      "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=800&auto=format&fit=crop&q=60",
    category: "Electronics",
    stock: 20,
  },
  {
    name: "Smart Watch Pro",
    price: 249.99,
    image:
      "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&auto=format&fit=crop&q=60",
    category: "Electronics",
    stock: 12,
  },
  {
    name: "4K Ultra HD Camera",
    price: 899.99,
    image:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=60",
    category: "Electronics",
    stock: 8,
  },
];

const FASHION_PRODUCTS = [
  {
    name: "Minimalist Travel Backpack",
    price: 79.99,
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=60",
    category: "Fashion",
    stock: 30,
  },
  {
    name: "Wireless Gaming Mouse",
    price: 89.99,
    image:
      "https://images.unsplash.com/photo-1527814050087-3793815479db?w=800&auto=format&fit=crop&q=60",
    category: "Electronics",
    stock: 25,
  },
  {
    name: "Smart Home Speaker",
    price: 159.99,
    image:
      "https://images.unsplash.com/photo-1589492477829-5e65395b66cc?w=800&auto=format&fit=crop&q=60",
    category: "Home",
    stock: 18,
  },
  {
    name: "LED Gaming Monitor",
    price: 449.99,
    image:
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=60",
    category: "Electronics",
    stock: 10,
  },
];

async function seedDatabase() {
  try {
    await connectDB();

    // Clear existing data
    await Product.deleteMany({});
    await User.deleteMany({});
    console.log("Cleared existing products and users");

    // Create Hashed Passwords
    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash("admin123", salt);
    const sellerPassword = await bcrypt.hash("seller123", salt);
    const buyerPassword = await bcrypt.hash("buyer123", salt);

    // Create Demo Users (Seeded users are pre-approved)
    const adminUser = await User.create({
      name: "Admin Manager",
      email: "admin@nexstore.com",
      password: adminPassword,
      role: "admin",
      isApproved: true,
    });

    const techSeller = await User.create({
      name: "Alex Tech",
      email: "seller@nexstore.com",
      password: sellerPassword,
      role: "seller",
      isApproved: true,
      shopName: "TechZone Official Store",
      shopImage:
        "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&auto=format&fit=crop&q=60",
      shopDescription: "Your one-stop shop for premium gadgets, cameras, and gaming accessories.",
    });

    const fashionSeller = await User.create({
      name: "Sarah Style",
      email: "fashion@nexstore.com",
      password: sellerPassword,
      role: "seller",
      isApproved: true,
      shopName: "Urban Gear & Fashion",
      shopImage:
        "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop&q=60",
      shopDescription: "Modern minimalist fashion, bags, and lifestyle accessories.",
    });

    const buyerUser = await User.create({
      name: "John Buyer",
      email: "buyer@nexstore.com",
      password: buyerPassword,
      role: "buyer",
      isApproved: true,
    });

    console.log("Created demo users & shops (All pre-approved)");

    // Link products to respective sellers
    const techProds = TECH_PRODUCTS.map((p) => ({ ...p, seller: techSeller._id }));
    const fashionProds = FASHION_PRODUCTS.map((p) => ({ ...p, seller: fashionSeller._id }));

    await Product.insertMany([...techProds, ...fashionProds]);

    console.log("MongoDB Database seeded successfully with multi-vendor Shops!");
    console.log("-----------------------------------------");
    console.log("Demo Accounts (Approved):");
    console.log("Admin:   admin@nexstore.com   / admin123");
    console.log("Seller1: seller@nexstore.com  / seller123  (TechZone Official Store)");
    console.log("Seller2: fashion@nexstore.com / seller123  (Urban Gear & Fashion)");
    console.log("Buyer:   buyer@nexstore.com   / buyer123");
    console.log("-----------------------------------------");

    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

seedDatabase();