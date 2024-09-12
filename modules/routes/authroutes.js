const express = require("express");
const router = express.Router();
const AuthController = require("../Controller/authController");

router.post("/signup", AuthController.SignUp);
router.post("/signin", AuthController.SignIn);
router.post("/saveAddress", AuthController.AddressDetails);
router.get("/getAddress/:userId", AuthController.getUserByAddress);
router.post("/createPromoCode", AuthController.createPromoCode);
router.post("/applyPromoCode", AuthController.applyPromoCode);
router.get("/getPromoCodes", AuthController.getPromoCodes);

module.exports = router;
