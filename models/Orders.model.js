const mongoose = require('mongoose');
const Product = require('./Product.model');

const orderSchema = new mongoose.Schema({
    totalProduct: Number,
    totalPrice: Number,
    totalProductPrice: Number,
    coupon: {
        code: String,
        discount: Number
    },
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product'
            },
            subTotal: Number,
            quantity: Number
        }
    ],
    orderBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    orderedAt: Date,
    deliveryStatus: {
        type: String,
        default: 'pending',
        enum: ['pending','cancelled','complete']
    },
    paymentStatus: {
        type: String,
        default: 'pending',
        enum: ['pending','paid','cancelled']
    },
    paymentMethod: String,
    address: String,
    country: String,
    state: String
});

orderSchema.pre(/^find/,function (next) {
    this.populate({path: 'orderBy',select: 'name email'}).populate({path: 'products.product',select: 'name image'})
    next();
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;