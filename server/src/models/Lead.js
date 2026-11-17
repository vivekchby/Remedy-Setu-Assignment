const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    businessType: {
      type: String,
      required: true,
      enum: ["Astrologer", "Retailer"]
    },
    productsOfInterest: {
      type: [String],
      required: true,
      validate: {
        validator: (items) => items.length > 0,
        message: "Select at least one product of interest"
      }
    },
    status: {
      type: String,
      enum: ["New", "Contacted", "Quoted", "Won", "Lost"],
      default: "New"
    },
    notes: { type: String, default: "", trim: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Lead", leadSchema);
