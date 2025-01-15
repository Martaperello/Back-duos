const mongoose = require('mongoose');
const slugify = require('slugify');

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        minlength: [5, 'Title must be at least 5 characters'],
        maxlength: [50, 'Title cannot exceed 50 characters']
    },
    description: {
        type: String,
        required: [true, 'Description is required']
    },
    category: {
        type: String,
        enum: {
            values: ['cafe', 'bolleria', 'bocatas'],
            message: 'Category must be either cafe, bolleria, or bocatas'
        },
        required: [true, 'Category is required']
    },
    ingredients: [
        {
            name: {
                type: String,
                required: [true, 'Ingredient name is required'],
                trim: true,
                minlength: [2, 'Ingredient name must be at least 5 characters']
            },
            quantity: {
                type: Number,
                required: [true, 'Ingredient quantity is required'],
                min: [0, 'Quantity must be a positive number']
            },
            unit: {
                type: String,
                required: [true, 'Ingredient unit is required']
            }
        }
    ],
    price: {
        type: Number,
        min: [0, "Price must be a positive number"],
        default: 0
    },
    stock: {
        type: Number,
        default: 0,
        min: [0, 'Stock cannot be a negative number'],
        required: [true, 'Stock is required']
    },
    image: {
        type: String,
        required: [true, 'Image path is required']  // Path to image in public folder
    },
    slug: String,
}, {
    timestamps: true
});

/*****************pre-save middleware*************************/

productSchema.pre('save', function (next) {
    this.slug = slugify(this.title, {
        lower: true      // convert to lower case
    })
    next();
})

module.exports = mongoose.model('Product', productSchema);
