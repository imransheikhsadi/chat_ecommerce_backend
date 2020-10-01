const express = require('express');
const { createProduct,getProducts, getSingleProduct, updateProduct, checkout } = require('../controllers/product.controller');
const { authenticate, checkModerator } = require('../controllers/auth.controller');


const router = express.Router();


router.post('/checkout',authenticate,checkout);
router.route('/')
.post(authenticate,checkModerator,createProduct)
.get(getProducts);

router.route('/:id')
.get(getSingleProduct)
.patch(authenticate,checkModerator,updateProduct)


module.exports = router;