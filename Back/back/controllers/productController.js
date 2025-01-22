const Product = require("../models/productModel")

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();

    if (!products) {
      res.status(400).json({
        status: 'No tiene productos cargados',
      })
    }

    res.status(201).json({
      status: 'success',
      data: {
        results: products.length,
        product: products,
      }
    })
  } catch (error) {
    res.status(500).json({
      status: 'error',
    })
  }
}

exports.getProductsByCategory = async (req, res) => {
  try {
    const category = req.params.category;

    const products = await Product.find({ category });

    if (!products) {
      return res.status(400).json({
        status: `No tiene productos con la categoria ${req.params.category}`,
      })
    }

    res.status(201).json({
      status: 'success',
      category: category,
      data: {
        results: products.length,
        product: products,
      }
    })

  } catch (error) {
    res.status(500).json({
      status: 'error',
    })
  }
}

exports.createProduct = async (req, res) => {
  try {
    const newProduct = await Product.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        product: newProduct
      }
    })
  } catch (error) {
    res.status(500).json({
      status: 'error',
    })
  }
}

exports.getProduct = async (req, res) => {

  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(400).json({
        status: 'error producto no encontrado',
      })
    }
    res.status(201).json({
      status: 'success',
      data: {
        product: product
      }
    })
  } catch (error) {
    res.status(500).json({
      status: 'error',
    })
  }
}

exports.updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const updateProduct = await Product.findByIdAndUpdate(productId, req.body, {
      new: true,
      runValidators: true
    })

    if (!updateProduct) {
      return res.status(400).json({
        status: 'error producto no pudo ser actualizado id errado',
      })
    }
    res.status(201).json({
      status: 'success',
      data: {
        product: updateProduct
      }
    })
  } catch (error) {
    res.status(500).json({
      status: 'error',
    })
  }
}


exports.deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const deletedProduct = await Product.findByIdAndDelete(productId)

    if (!deletedProduct) {
      return res.status(400).json({
        status: 'error producto no pudo ser borrado id errado',
      })
    }
    res.status(204).json({
      status: 'success',
    })
  } catch (error) {
    res.status(500).json({
      status: 'error',
    })
  }
}

exports.getProductsById = async (req, res) => {
  try {
    const {products_ids} = req.body;

    // console.log('PRID', products_ids);
    

    if (!Array.isArray(products_ids) || products_ids.length <= 0) {
      return res.status(400).json({
        status: 'error',
        message: "Favor proveer un array valido"
      })
    }

    const products = await Product.find({ _id: { $in: products_ids } })

    if (products.length == 0) {
      return res.status(400).json({
        status: 'error',
        message: "No hay productos con los ids proveidos"
      })
    }


    res.status(200).json({
      status: 'error',
      data: {
        products
      }
    })


  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: "Un error a ocurrido con los prodiuctos requeridos"
    })
  }
}


// Add a product to featured or remove it
exports.toggleFeaturedProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        status: 'error',
        message: 'Producto no encontrado',
      });
    }

    product.featured = !product.featured;
    await product.save();

    res.status(200).json({
      status: 'success',
      message: `Producto ${product.featured ? 'agregado a destacados' : 'eliminado de destacados'}`,
      data: {
        product,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Un error ocurrió mientras se actualizaba el producto',
    });
  }
};

// Get all featured products
exports.getAllFeaturedProducts = async (req, res) => {
  try {
    const featuredProducts = await Product.find({ featured: true });

    if (featuredProducts.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'No hay productos destacados',
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        results: featuredProducts.length,
        products: featuredProducts,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Un error ocurrió mientras se obtenían los productos destacados',
    });
  }
};



