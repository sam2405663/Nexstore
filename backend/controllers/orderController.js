import Order from "../models/Order.js";
import Product from "../models/Product.js";

// @desc    Create new order
// @route   POST /api/orders
// @access  Private (Buyer)
export const createOrder = async (req, res) => {
  const { orderItems, totalPrice, paymentMethod } = req.body;

  if (!orderItems || orderItems.length === 0) {
    return res.status(400).json({ success: false, message: "No order items provided" });
  }

  try {
    const createdOrder = await Order.create({
      buyer: req.user._id,
      orderItems,
      totalPrice,
      paymentMethod: paymentMethod || "Stripe",
      isPaid: true, // Auto-mark paid for demo
      paidAt: Date.now(),
    });

    res.status(201).json({ success: true, data: createdOrder });
  } catch (error) {
    console.error("Create Order Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private (Buyer)
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ buyer: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, data: orders });
  } catch (error) {
    console.error("Get My Orders Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @desc    Get orders containing products for logged in seller
// @route   GET /api/orders/seller
// @access  Private (Seller/Admin)
export const getSellerOrders = async (req, res) => {
  try {
    let orders;
    if (req.user.role === "admin") {
      orders = await Order.find({}).populate("buyer", "name email").sort({ createdAt: -1 });
    } else {
      orders = await Order.find({ "orderItems.seller": req.user._id })
        .populate("buyer", "name email")
        .sort({ createdAt: -1 });
    }
    res.json({ success: true, data: orders });
  } catch (error) {
    console.error("Get Seller Orders Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private (Seller/Admin)
export const updateOrderStatus = async (req, res) => {
  const { status } = req.body;

  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    order.status = status || order.status;
    const updatedOrder = await order.save();

    res.json({ success: true, data: updatedOrder });
  } catch (error) {
    console.error("Update Order Status Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
