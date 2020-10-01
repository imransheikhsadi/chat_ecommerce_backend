const express = require('express');
const { checkAdmin, authenticate, checkModerator } = require('../controllers/auth.controller');
const { createDocument, getAllDocument, updateDocument, updateSiteProperties, getSiteProperties, createCoupon, getCoupons, deleteCoupon, getCoupon, paypalPaymentCapture } = require('../controllers/other.controller');


const router = express.Router();


router.route('/')
      // .post(authenticate,checkModerator,createProduct)
      .post(createDocument)
      .get(getAllDocument);
router.route('/siteProperties')
      // .post(authenticate,checkModerator,createProduct)
      .post(authenticate,checkAdmin,updateSiteProperties)
      .get(getSiteProperties);
router.route('/coupons')
      .post(authenticate,checkAdmin,createCoupon)
      .get(authenticate,checkModerator,getCoupons)
      .delete(authenticate,checkAdmin,deleteCoupon);
router.post('/getCoupon',getCoupon)
router.post('/paypalPaymentCapture',paypalPaymentCapture)
      
    
// router.route('/:code')
      

module.exports = router;