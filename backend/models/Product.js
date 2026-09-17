import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    image: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      default: "General",
    },
    stock: {
      type: Number,
      default: 10,
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual property to map _id to id for frontend compatibility
productSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

const Product = mongoose.model("Product", productSchema);

export default Product;
