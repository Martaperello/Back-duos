const Cart = require("../models/cartModel");
const Product = require("../models/productModel");
const User = require("../models/userModel");

exports.getCartProducts = async (req, res) => {
  try {
    const user = req.params.userId;
    if (!await User.findById(user)) {
      return res.status(400).json({
        status: 'No ahi productos asociados a este usuario'
      })
    }

    const cart = await Cart.find({ user });
    // console.log('cartTest', cart)

    if (!cart || cart[0].items.length === 0) {
      return res.status(400).json({
        status: 'No tienes productos en tu carrito',
      })
    }

    const cartPopulated = await Cart.find({ user }).populate('items.product');
   

    res.status(201).json({
      status: 'success',
      data: {
        cart: cartPopulated 
      }
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      status: 'error',
    })
  }
}

exports.createCartProduct = async (req, res) => {
  try {
    const { items } = req.body;
    const { userId } = req.params;

    // console.log('items', items);
    

    // if(!items) {
    //   return res.status(400).json({
    //     status: 'fail',
    //     message : No 
    //   })
    // }
    // Validate User

    if (!await User.findById(userId)) {
      return res.status(400).json({
        status: 'error',
        message: "User doesn't exist"
      })
    }

    // Validate if product Exist

    let areProducts = '';

    if (items && items.length > 0) {
      let checkProducts = await Promise.all(
        items.map(async item => {
          const product = await Product.findById(item.product);
          return !!product;
        })
      )
      areProducts = checkProducts.every(element => element == true);
    }



   let cart = await Cart.findOne({ user: userId });


    if (!cart && areProducts) {
      cart = await Cart.create({
        user: userId,
        items
      })
    } else {
      cart.items = items
      await cart.save();
    }

    // Fetch the complete cart with populated fields and virtual totalPrice
    const completeCart = await Cart.findOne({ user: userId })


    return res.status(200).json({
      status: 'success',
      meesage: 'Cart created or updated succesfully',
      data: completeCart
    })




  } catch (error) {
    console.log(error)
    res.status(500).json({
      status: 'error',
    })
  }
}