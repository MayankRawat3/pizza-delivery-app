import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    // ========================================
    // LOGGED-IN USER
    // ========================================

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },


    // ========================================
    // ORDER ITEMS / CUSTOM PIZZAS
    // ========================================

    items: [
      {
        name: {
          type: String,
          required: true
        },

        base: {
          type: String,
          required: true
        },

        sauce: {
          type: String,
          required: true
        },

        cheese: {
          type: String,
          required: true
        },

        vegetables: {
          type: [String],
          default: []
        },

        price: {
          type: Number,
          required: true,
          min: 0
        },

        quantity: {
          type: Number,
          required: true,
          min: 1
        }
      }
    ],


    // ========================================
    // DELIVERY ADDRESS
    // ========================================

    deliveryAddress: {
      name: {
        type: String,
        required: true,
        trim: true
      },

      phone: {
        type: String,
        required: true,
        trim: true
      },

      address: {
        type: String,
        required: true,
        trim: true
      },

      city: {
        type: String,
        required: true,
        trim: true
      },

      pincode: {
        type: String,
        required: true,
        trim: true
      }
    },


    // ========================================
    // PRICE DETAILS
    // ========================================

    subtotal: {
      type: Number,
      required: true,
      min: 0
    },

    deliveryFee: {
      type: Number,
      default: 40,
      min: 0
    },

    total: {
      type: Number,
      required: true,
      min: 0
    },


    // ========================================
    // RAZORPAY PAYMENT DETAILS
    // ========================================

    razorpayOrderId: {
      type: String,
      required: true
    },

    razorpayPaymentId: {
      type: String,
      required: true
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending"
    },


    // ========================================
    // ORDER STATUS
    // ========================================

    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "preparing",
        "out-for-delivery",
        "delivered",
        "cancelled"
      ],
      default: "pending"
    }
  },

  {
    timestamps: true
  }
);


const Order = mongoose.model("Order", orderSchema);

export default Order;