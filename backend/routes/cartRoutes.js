const express = require('express');
const { getCartProducts, createCartProduct } = require('../controllers/cartControllers');
const router = express.Router();

// router.route('/').get(getCartProducts);


router.route('/:userId')
  .get(getCartProducts)
  .post(createCartProduct)
  // .delete(deleteProduct)


module.exports = router;