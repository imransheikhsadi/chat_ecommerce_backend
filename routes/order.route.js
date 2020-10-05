const express = require('express');
const { getOrders, updateOrder } = require('../controllers/order.controller');


const router = express.Router();


router.route('/')
.get(getOrders);

router.route('/:id')
.post(updateOrder);



module.exports = router;