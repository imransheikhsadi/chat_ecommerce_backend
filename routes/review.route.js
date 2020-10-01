const express = require('express');
const { authenticate } = require('../controllers/auth.controller');
const { createReview, getReviews } = require('../controllers/review.controller');


const router = express.Router();


router.route('/')
.post(authenticate,createReview)

router.route('/:id')
.get(getReviews)





module.exports = router;