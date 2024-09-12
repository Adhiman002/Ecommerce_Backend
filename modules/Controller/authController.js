const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Address = require("../models/Address");
const PromoCode = require("../models/PromoCode");

const SignUp = async (req, res) => {
  const { username, email, password } = req.body;
  console.log(username, email, password);
  // Basic validation
  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Check if the email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const newUser = new User({ username, email, password: hashedPassword});
    await newUser.save();

    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ message: "Error creating user", error: err.message });
  }
};

const SignIn = async (req, res) => {
  const { email, password } = req.body;

  // Check if email and password are provided
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Compare the provided password with the hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    // Respond with the token
    res.status(200).json({ message: "Sign in successful", token });
  } catch (err) {
    res.status(500).json({ message: "Error signing in", error: err.message });
  }
};
const AddressDetails = async (req, res) => {
  const { name, phone, userId, address, city, state, zip } = req.body;
  console.log(req.body);
  try {
    const newUser = new Address({ name, phone, userId, address, city, state, zip });
    await newUser.save();

    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ message: "Error creating user", error: err.message });
  }
};
const getUserByAddress = async (req, res) => {
  try {
    const userId = req.params.userId;
    const address = await Address.find({ userId: userId });
    if (address.length === 0) {
      return res.status(404).json({ message: "No addresses found for this user." });
    }
    res.json(address);
  } catch (error) {
    res.status(500).json({ message: "Error creating user", error: err.message });
  }
};

const createPromoCode = async (req, res) => {
  try {
    const { code, discount, expiryDate, usageLimit } = req.body;
    const newPromoCode = new PromoCode({ code, discount, expiryDate, usageLimit });
    await newPromoCode.save();
    res.status(201).json({ success: true, message: "Promo code created successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error creating promo code", error: error.message });
  }
};

const applyPromoCode = async (req, res) => {
  try {
    const { code, cartTotal } = req.body;
    const promo = await PromoCode.findOne({ code });

    if (promo) {
      // Check if promo code is active, not expired, and within usage limit
      if (promo.isActive && promo.expiryDate > Date.now() && promo.usageLimit > 0) {
        // Check if cart total exceeds the minimum amount for this promo code
        if (cartTotal >= promo.minimumAmount) {
          // Optionally decrement usageLimit
          promo.usageLimit -= 1;
          await promo.save();
          res.json({ success: true, message: "Promo code applied successfully!", discount: promo.discount });
        } else {
          res.json({ success: false, message: `Minimum cart amount for this promo code is ${promo.minimumAmount}.` });
        }
      } else {
        res.json({ success: false, message: "Promo code is inactive or expired." });
      }
    } else {
      res.json({ success: false, message: "Invalid promo code." });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Error applying promo code", error: error.message });
  }
};

const getPromoCodes = async (req, res) => {
  try {
    const promoCodes = await PromoCode.find();
    res.json(promoCodes);
  } catch (error) {
    res.status(500).json({ message: "Error fetching promo codes", error: error.message });
  }
};

module.exports = {
  SignUp,
  SignIn,
  AddressDetails,
  getUserByAddress,
  createPromoCode,
  applyPromoCode,
  getPromoCodes,
};
