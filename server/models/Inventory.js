import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    category: {
      type: String,
      required: true,
      enum: ["base", "sauce", "cheese", "vegetable"]
    },

    quantity: {
      type: Number,
      required: true,
      min: 0,
      default: 0
    },

    threshold: {
      type: Number,
      required: true,
      min: 0,
      default: 10
    },

    unit: {
      type: String,
      required: true,
      trim: true,
      default: "pieces"
    }
  },
  {
    timestamps: true
  }
);

const Inventory = mongoose.model(
  "Inventory",
  inventorySchema
);

export default Inventory;