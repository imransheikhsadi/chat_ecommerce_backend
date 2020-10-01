const express = require('express');
const { checkModerator, authenticate } = require('../controllers/auth.controller');
const { newOrders, totalIncome,getMainStats, summary, latestBayers } = require('../controllers/stats.controller');


const router = express.Router();

router.post('/',authenticate,checkModerator,getMainStats)
router.post('/summary',authenticate,checkModerator,summary)
router.post('/latestBayers',authenticate,checkModerator,latestBayers)
// router.get('/income',totalIncome)

module.exports = router;
