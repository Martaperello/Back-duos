const express = require('express');
const { createProduct, getProduct, updateProduct, deleteProduct, getAllProducts, getProductsByCategory, getProductsById } = require('../controllers/productController');
const router = express.Router();

router.route('/').get(getAllProducts).post(createProduct)
router.route('/categories/:category').get(getProductsByCategory);
router.route('/products/by-id').post(getProductsById);
router.route('/featured').get(getAllFeaturedProducts);
router.route('/:id/featured').patch(toggleFeaturedProduct)

router.route('/:id')
  .get(getProduct)
  .patch(updateProduct)
  .delete(deleteProduct)


module.exports = router;