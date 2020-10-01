const express = require('express');
const { createProduct,getProducts, getSingleProduct, updateProduct, checkout } = require('../controllers/product.controller');
const { authenticate, checkModerator } = require('../controllers/auth.controller');
const { getOrders, updateOrder } = require('../controllers/order.controller');


const router = express.Router();


router.route('/')
// .post(authenticate,checkModerator,createProduct)
// .post(createProduct)
.get(getOrders);

router.route('/:id')
// .post(authenticate,checkModerator,createProduct)
// .post(createProduct)
.post(updateOrder);



module.exports = router;