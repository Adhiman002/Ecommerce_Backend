const mongoose = require("mongoose");

const promoCodeSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  discount: { type: Number, required: true }, // Discount percentage or fixed amount
  isActive: { type: Boolean, default: true },
  expiryDate: { type: Date, required: true },
  usageLimit: { type: Number, default: 1 }, // Optional: Number of times the code can be used
  minimumAmount: { type: Number, required: true },
});

module.exports = mongoose.model("PromoCode", promoCodeSchema);
