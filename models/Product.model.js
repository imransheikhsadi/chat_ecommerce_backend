const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product Must have a name']
    },
    price: {
        type: Number,
        required: [true, 'Product must have a Price']
    },
    currentPrice: Number,
    productCode: {
        type: String,
        unique: true,
        required: [true, 'Please give product a code']
    },
    catagory: String,
    tags: [String],
    quantity: {
        type: Number,
        required: [true, 'How many product do you have?']
    },
    sold: {
        type: Number,
        default: 0
    },
    basePrice: Number,
    image: {
        small: [mongoose.Schema.Types.Mixed],
        card: [mongoose.Schema.Types.Mixed],
        original: [mongoose.Schema.Types.Mixed]
    },
    totalStar: {
        type: Number,
        default: 0
    },
    title: String,
    variant: Boolean,
    description: String,
    createdAt: {
        type: Date,
        default: Date.now()
    },
    active: {
        type: Boolean,
        default: true
    }
});

productSchema.index({
    'name': 'text',
    'productCode':'text',
    'brand': 'text',
    'title': 'text',
    'catagory': 'text',
    'tags': 'text',
    'productType': 'text',
    'variantCode': 'text'
});


const Product = mongoose.model('Product',productSchema);

module.exports = Product;