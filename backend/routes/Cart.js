const express = require("express");
const {
  addToCart,
  fetchCartByUser,
  deleteFromCart,
  updateCart,
  fetchAllCart,
} = require("../controller/Cart");

const router = express.Router();
//  /products is already added in base path
router
  .post("/", addToCart)
  .get("/all", fetchAllCart)
  .get("/:userId", fetchCartByUser)
  
  
  .delete("/:id", deleteFromCart)
  .patch("/:id", updateCart);

exports.router = router;
