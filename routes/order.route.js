const express = require('express');
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