const mongoose = require('mongoose');


const cartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true, min: 1 }
    }
  ], total: {
    type: Number,
    min: [0, 'Total can not be negative'],
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});



// Static method to calculate the total price
cartSchema.statics.calcTotalPrice = async function (cartId) {
  const cart = await this.findById(cartId).populate('items.product');

  if (!cart) {
    console.error(`Cart not found with ID: ${cartId}`);
    return; // Exit early if no cart is found
  }


  // Calculate total based on each item's price and quantity
  const total = cart.items.reduce((acc, item) => {
    return acc + (item.product.price * item.quantity);
  }, 0);

  // Update the cart's total
  cart.total = total;
  await cart.save();
};


// Middleware to call calcTotalPrice after saving a cart
cartSchema.post('save', function () {
  // Check if the document still exists before running calcTotalPrice
  if (this.isDeleted) return;
  this.constructor.calcTotalPrice(this._id).catch(error => {
    console.error(`Error calculating total price for cart ID: ${this._id}`, error);
  });
});

// Add a flag to skip calculations on deletion
cartSchema.pre('remove', function (next) {
  this.isDeleted = true;
  next();
});



module.exports = mongoose.model('Cart', cartSchema);
