const express = require('express');
const { checkAdmin, authenticate} = require('../controllers/auth.controller');
const { updateSiteProperties, getSiteProperties, paypalPaymentCapture } = require('../controllers/other.controller');


const router = express.Router();


router.route('/siteProperties')
      .post(authenticate,checkAdmin,updateSiteProperties)
      .get(getSiteProperties);

router.post('/paypalPaymentCapture',paypalPaymentCapture)

module.exports = router;