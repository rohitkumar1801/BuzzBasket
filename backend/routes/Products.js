const express = require('express');
const { createProduct, fetchAllProducts, fetchProductById, updateProduct, deleteProduct } = require('../controller/Product.updated');

const router = express.Router();

router.post('/', createProduct)
      .get('/', fetchAllProducts)
      .get('/:id', fetchProductById)
      .patch('/:id', updateProduct)
      .delete('/:id', deleteProduct)

module.exports = router;
