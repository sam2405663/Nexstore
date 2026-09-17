import User from "../models/User.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";

// @desc    Get dashboard statistics for Admin
// @route   GET /api/admin/stats
// @access  Private (Admin)
export const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalSellers = await User.countDocuments({ role: "seller" });
    const totalBuyers = await User.countDocuments({ role: "buyer" });
    const pendingUsers = await User.countDocuments({ isApproved: false, role: { $ne: "admin" } });
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();

    const revenueResult = await Order.aggregate([
      { $group: { _id: null, totalRevenue: { $sum: "$totalPrice" } } },
    ]);

    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

    res.json({
      success: true,
      data: {
        totalUsers,
        totalSellers,
        totalBuyers,
        pendingUsers,
        totalProducts,
        totalOrders,
        totalRevenue,
      },
    });
  } catch (error) {
    console.error("Admin Stats Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @desc    Get all users for Admin
// @route   GET /api/admin/users
// @access  Private (Admin)
export const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password").sort({ createdAt: -1 });
    res.json({ success: true, data: users });
  } catch (error) {
    console.error("Get Users Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @desc    Approve or revoke user account approval (Admin only)
// @route   PUT /api/admin/users/:id/approve
// @access  Private (Admin)
export const approveUser = async (req, res) => {
  const { isApproved } = req.body;

  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user.role === "admin") {
      return res.status(400).json({ success: false, message: "Admin account is always approved" });
    }

    user.isApproved = typeof isApproved === "boolean" ? isApproved : !user.isApproved;
    await user.save();

    res.json({
      success: true,
      message: `Account for ${user.name} has been ${user.isApproved ? "Approved" : "Revoked"}`,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        isApproved: user.isApproved,
      },
    });
  } catch (error) {
    console.error("Approve User Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @desc    Delete user account (Admin only, cannot delete self)
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin)
export const deleteUser = async (req, res) => {
  const targetId = req.params.id;

  if (targetId === req.user._id.toString()) {
    return res.status(400).json({ success: false, message: "Admin cannot delete their own account" });
  }

  try {
    const user = await User.findById(targetId);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // If deleting a seller, remove their products
    if (user.role === "seller") {
      await Product.deleteMany({ seller: user._id });
    }

    await User.findByIdAndDelete(targetId);

    res.json({ success: true, message: "User account deleted successfully" });
  } catch (error) {
    console.error("Delete User Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @desc    Update user role (promote/demote)
// @route   PUT /api/admin/users/:id/role
// @access  Private (Admin)
export const updateUserRole = async (req, res) => {
  const { role } = req.body;

  if (!["buyer", "seller"].includes(role)) {
    return res.status(400).json({ success: false, message: "Invalid role" });
  }

  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user.role === "admin") {
      return res.status(400).json({ success: false, message: "Cannot modify Admin user role" });
    }

    user.role = role;
    await user.save();

    res.json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Update User Role Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
