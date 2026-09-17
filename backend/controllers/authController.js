import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "fallback_secret", {
    expiresIn: "30d",
  });
};

// @desc    Register a new user (Buyer or Seller) - Requires Admin Approval
// @route   POST /api/auth/register
export const register = async (req, res) => {
  const { name, email, password, role, shopName, shopImage, shopDescription } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: "Please provide all required fields" });
  }

  // Mandatory shop fields for Seller registration
  if (role === "seller") {
    if (!shopName || !shopImage) {
      return res.status(400).json({
        success: false,
        message: "Shop Name and Seller Image / Logo are mandatory for Seller registration",
      });
    }
  }

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ success: false, message: "User already exists with this email" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const assignedRole = role === "seller" ? "seller" : "buyer";

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: assignedRole,
      isApproved: false, // New registrations must be approved by Admin
      shopName: assignedRole === "seller" ? shopName : "",
      shopImage: assignedRole === "seller" ? shopImage : "",
      shopDescription: assignedRole === "seller" && shopDescription ? shopDescription : "Welcome to our shop!",
    });

    if (user) {
      res.status(201).json({
        success: true,
        message: "Account registered successfully! Please wait for Admin approval before logging in.",
        data: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isApproved: user.isApproved,
          shopName: user.shopName,
          shopImage: user.shopImage,
        },
      });
    } else {
      res.status(400).json({ success: false, message: "Invalid user data" });
    }
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @desc    Authenticate user & get token (Check Admin approval)
// @route   POST /api/auth/login
export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Please enter email and password" });
  }

  try {
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      // Check Admin Approval for Buyers and Sellers (Admin is always approved)
      if (user.role !== "admin" && !user.isApproved) {
        return res.status(403).json({
          success: false,
          message: "Your account is pending Admin approval. Please wait for an Admin to approve your account.",
        });
      }

      res.json({
        success: true,
        data: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isApproved: user.isApproved,
          shopName: user.shopName,
          shopImage: user.shopImage,
          token: generateToken(user._id),
        },
      });
    } else {
      res.status(401).json({ success: false, message: "Invalid email or password" });
    }
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("GetMe Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
