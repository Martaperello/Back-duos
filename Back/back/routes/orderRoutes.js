const express = require('express');
const { getAllOrders, createOrder, getOrder } = require('../controllers/orderController');
const router = express.Router();

router.route('/').get(getAllOrders)


router.route('/:userId')
.post(createOrder)

router.route('/order/:orderId')
.get(getOrder)
  

module.exports = router;