const mongoose = require('mongoose');


const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
      product: {type:mongoose.Schema.Types.ObjectId, ref:'Product', required: true},
      quantity: {type: Number, required: true,  min: [1, 'Quantity can not be less than 0']},
      finalPrice: {type: Number, required: true}
    }
  ],
  total: {
    type: Number,
    required: true,
    min: [0, 'Total cannot be negative']
  },
  status: {
    type: String,
    enum: ['paid', 'completed', 'cancelled'],
    default: 'paid'
  },

}, {
  timestamps: true,
  toJSON: { virtuals: true }, 
  toObject: { virtuals: true }
});

// Mongoose Method


orderSchema.statics.createFromCart = async function(cartId) {
  const Cart = mongoose.model('Cart');
  const cart = await Cart.findById(cartId).populate('items.product');

  if(!cart) throw new Error(`Can't not find a cart with id ${cartId}`)

  const orderItems = cart.items.map(item => ({
    product: item.product._id,
    quantity: item.quantity,
    finalPrice: item.product.price
  }))

 const total = cart.total

 const order = await this.create({
  user: cart.user,
  items: orderItems,
  total
 })

 return order
}


module.exports = mongoose.model('Order', orderSchema);
