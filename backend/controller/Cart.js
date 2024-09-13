const { Cart } = require("../model/Cart");

exports.fetchAllCart = async (req, res) => {
  const carts = await Cart.find({});

  res.status(200).json({
    status: "success",
    message: "All Carts are fetched successfully",
    data: carts,
  });
};

exports.fetchCartByUser = async (req, res) => {
  
  const {userId} = req.user;

  try {
    
    const cart = await Cart.findOne({ user: userId }).populate({
      path: "items.product", // Populate the product field inside items
      select: "", // Adjust fields to populate
    });

    // Check if the cart exists
    if (!cart) {
      return res.status(404).json({
        status: "error",
        message: "Cart not found for the specified user",
      });
    }

    // Return cart items with a success status
    res.status(200).json({
      status: "success",
      message: "Cart items fetched successfully",
      cart,
    });
  } catch (err) {
    // Handle errors and return a descriptive message
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

exports.addToCart = async (req, res) => {

  const { quantity, product } = req.body;
 
  const {userId} = req.user;
 
  // Input validation
  if (quantity < 0 || !product ) {
    return res.status(400).json({
      status: "error",
      message: "Valid Quantity and product fields are required",
    });
  }

  

  try {
    // Find or create a cart for the user
    let cart = await Cart.findOne({user: userId });
    console.log("cart..", cart)

    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
      console.log("cart....", cart)
    }

    

    // Check if the product already exists in the cart
    const existingItem = cart.items.find(
      (item) => item.product.toString() === product
    );

    if (existingItem) {
      // Update quantity if the product is already in the cart
      existingItem.quantity += quantity;
    } else {
      // Add a new product to the cart
      cart.items.push({ product, quantity });
    }

    // Save the cart
    const updatedCart = await cart.save();

    // Populate product details in the cart
    await updatedCart.populate("items.product");

    console.log("updatedCart", updatedCart)

    // Return the updated cart with a success status
    res.status(200).json({
      status: "success",
      message: "Cart updated successfully",
      updatedCart,
    });
  } catch (err) {
    // Handle errors and return a descriptive message
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

exports.deleteFromCart = async (req, res) => {
  const { id } = req.params;
  try {
    const doc = await Cart.findByIdAndDelete(id);
    res.status(200).json(doc);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.updateCart = async (req, res) => {
  const { id } = req.params;
  try {
    const cart = await Cart.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    const result = await cart.populate("product");

    res.status(200).json(result);
  } catch (err) {
    res.status(400).json(err);
  }
};
