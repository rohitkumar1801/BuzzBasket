const { Cart } = require('../model/Cart');

exports.fetchAllCart = async (req, res) => {

  const carts = await Cart.find({});
  
  res.status(200).json({
    status: 'success',
    message: 'All Carts are fetched successfully',
    data: carts,
  });

}

exports.fetchCartByUser = async (req, res) => {
  const { user } = req.query;

  // Check if the user query parameter is provided
  if (!user) {
    return res.status(400).json({
      status: 'error',
      message: 'User query parameter is required',
    });
  }

  try {
    // Fetch the cart for the specified user
    const cart = await Cart.findOne({ user }).populate({
      path: 'items.product', // Populate the product field inside items
      select: '', // Adjust fields to populate
    });
    
    // Check if the cart exists
    if (!cart) {
      return res.status(404).json({
        status: 'error',
        message: 'Cart not found for the specified user',
      });
    }

    // Return cart items with a success status
    res.status(200).json({
      status: 'success',
      message: 'Cart items fetched successfully',
      data: cart,
    });
  } catch (err) {
    // Handle errors and return a descriptive message
    res.status(500).json({
      status: 'error',
      message: 'Internal Server Error',
      error: err.message,
    });
  }
};

exports.addToCart = async (req, res) => {
  const { quantity, product, user } = req.body;

  // Input validation
  if (!quantity || !product || !user) {
    return res.status(400).json({
      status: 'error',
      message: 'Quantity, product, and user fields are required',
    });
  }

  try {
    // Find or create a cart for the user
    let cart = await Cart.findOne({ user }).exec();

    if (!cart) {
      cart = new Cart({ user, items: [] });
    }

    // Check if the product already exists in the cart
    const existingItem = cart.items.find(item => item.product.toString() === product);

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
    await updatedCart.populate('items.product');

    // Return the updated cart with a success status
    res.status(200).json({
      status: 'success',
      message: 'Cart updated successfully',
      data: updatedCart,
    });
  } catch (err) {
    // Handle errors and return a descriptive message
    res.status(500).json({
      status: 'error',
      message: 'Internal Server Error',
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
    const result = await cart.populate('product');

    res.status(200).json(result);
  } catch (err) {
    res.status(400).json(err);
  }
};
