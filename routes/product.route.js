const express = require('express');
const { createProduct,getProducts, getSingleProduct, updateProduct, checkout, deleteProduct } = require('../controllers/product.controller');
const { authenticate, checkModerator, checkAdmin } = require('../controllers/auth.controller');


const router = express.Router();


router.post('/checkout',authenticate,checkout);
router.route('/')
.post(authenticate,checkAdmin,createProduct)
.get(getProducts);

router.route('/:id')
.get(getSingleProduct)
.patch(authenticate,checkModerator,updateProduct)
.delete(authenticate,checkAdmin,deleteProduct)


module.exports = router;