const express = require("express");
const {
  addToCart,
  fetchCartByUser,
  deleteFromCart,
  updateCart,
  fetchAllCart,
} = require("../controller/Cart");
const { verifyByToken } = require("../middlewares/verifyByToken");

const router = express.Router();
//  /products is already added in base path
router
  .post("/", verifyByToken, addToCart)
  .get("/all", fetchAllCart)
  .get("/", verifyByToken, fetchCartByUser)
  
  .delete("/:id", deleteFromCart)
  .patch("/:id", updateCart);

exports.router = router;
