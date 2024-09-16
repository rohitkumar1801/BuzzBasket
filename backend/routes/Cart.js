const express = require("express");
const {
  
  fetchCartByUser,
  deleteFromCart,
  updateCart,
  fetchAllCart,
  handleQuantityInCart,
} = require("../controller/Cart");
const { verifyByToken } = require("../middlewares/verifyByToken");

const router = express.Router();
//  /products is already added in base path
router
  .post("/", verifyByToken, handleQuantityInCart)
  .get("/all", fetchAllCart)
  .get("/", verifyByToken, fetchCartByUser)
  .delete("/", verifyByToken, deleteFromCart)
  .patch("/:id", updateCart);

exports.router = router;
