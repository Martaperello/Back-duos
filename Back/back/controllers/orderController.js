const cartModel = require("../models/cartModel");
const Order = require("../models/orderModel");

exports.getAllOrders = async (req, res) => {

}

exports.getOrder = async (req, res) => {

}

exports.createOrder = async (req, res) => {

  try {
    const { cartId } = req.body;
    const { userId } = req.params;

    const order = await Order.createFromCart(cartId);

    // Safely delete the active cart
    const cart = await cartModel.findById(cartId);
    if (cart) {
      await cart.deleteOne(); // Bypass potential middleware issues
    }


    res.status(201).json({
      status: 'success',
      message: 'Order created succesfully',
      order
    })
  } catch (error) {
    console.log(error)
  }
}