import Product from "../models/Product.js";

export const getProducts = async (req, res) => {
  try {
    const filter = {};
    if (req.query.seller) {
      filter.seller = req.query.seller;
    }

    const products = await Product.find(filter)
      .populate("seller", "name shopName shopImage shopDescription")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: products });
  } catch (error) {
    console.log("Error in getProducts function", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const createProduct = async (req, res) => {
  if (!req.user || req.user.role !== "seller") {
    return res.status(403).json({
      success: false,
      message: "Only registered Sellers can add products to their shop",
    });
  }

  const { name, price, image, category, stock } = req.body;

  if (!name || !price || !image) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  try {
    const newProduct = await Product.create({
      name,
      price: Number(price),
      image,
      category: category || "General",
      stock: stock ? Number(stock) : 10,
      seller: req.user._id,
    });

    const populatedProduct = await Product.findById(newProduct._id).populate(
      "seller",
      "name shopName shopImage"
    );

    res.status(201).json({ success: true, data: populatedProduct });
  } catch (error) {
    console.log("Error in createProduct function", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findById(id).populate(
      "seller",
      "name shopName shopImage shopDescription"
    );

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.status(200).json({ success: true, data: product });
  } catch (error) {
    console.log("Error in getProduct function", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, price, image, category, stock } = req.body;

  if (!req.user) {
    return res.status(401).json({ success: false, message: "Not authorized" });
  }

  try {
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // Strictly check if logged-in user is the seller of this product
    if (req.user.role !== "seller" || product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: You can only edit products belonging to your own shop",
      });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { name, price: Number(price), image, category, stock },
      { new: true, runValidators: true }
    ).populate("seller", "name shopName shopImage");

    res.status(200).json({ success: true, data: updatedProduct });
  } catch (error) {
    console.log("Error in updateProduct function", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  if (!req.user) {
    return res.status(401).json({ success: false, message: "Not authorized" });
  }

  try {
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // Strictly check if logged-in user is the seller of this product
    if (req.user.role !== "seller" || product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: You can only delete products belonging to your own shop",
      });
    }

    const deletedProduct = await Product.findByIdAndDelete(id);

    res.status(200).json({ success: true, data: deletedProduct });
  } catch (error) {
    console.log("Error in deleteProduct function", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};