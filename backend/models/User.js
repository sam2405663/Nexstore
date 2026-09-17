import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["buyer", "seller", "admin"],
      default: "buyer",
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    avatar: {
      type: String,
      default: "",
    },
    // Shop fields for sellers
    shopName: {
      type: String,
      trim: true,
      default: "",
    },
    shopImage: {
      type: String,
      trim: true,
      default: "",
    },
    shopDescription: {
      type: String,
      default: "Welcome to our store! We offer quality products with fast shipping.",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

const User = mongoose.model("User", userSchema);

export default User;
