import User from "../models/User.js";
import Product from "../models/Product.js";

// @desc    Get all active Shops / Stores
// @route   GET /api/shops
// @access  Public
export const getShops = async (req, res) => {
  try {
    const sellers = await User.find({ role: "seller" })
      .select("-password")
      .sort({ createdAt: -1 });

    // Aggregate product counts per seller
    const shopsWithCount = await Promise.all(
      sellers.map(async (seller) => {
        const productCount = await Product.countDocuments({ seller: seller._id });
        return {
          id: seller._id,
          name: seller.name,
          email: seller.email,
          shopName: seller.shopName || `${seller.name}'s Shop`,
          shopImage:
            seller.shopImage ||
            "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop&q=60",
          shopDescription: seller.shopDescription,
          productCount,
        };
      })
    );

    res.status(200).json({ success: true, data: shopsWithCount });
  } catch (error) {
    console.error("Get Shops Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @desc    Get specific Shop details & products
// @route   GET /api/shops/:id
// @access  Public
export const getShopById = async (req, res) => {
  try {
    const seller = await User.findById(req.params.id).select("-password");

    if (!seller || seller.role !== "seller") {
      return res.status(404).json({ success: false, message: "Shop not found" });
    }

    const products = await Product.find({ seller: seller._id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: {
        shop: {
          id: seller._id,
          name: seller.name,
          email: seller.email,
          shopName: seller.shopName || `${seller.name}'s Shop`,
          shopImage:
            seller.shopImage ||
            "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop&q=60",
          shopDescription: seller.shopDescription,
        },
        products,
      },
    });
  } catch (error) {
    console.error("Get Shop By ID Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
