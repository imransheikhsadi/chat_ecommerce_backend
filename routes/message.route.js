const express = require('express');
const { authenticate, checkMessagePermission } = require('../controllers/auth.controller');
const { getMessages, createMessage, getGroupMessages } = require('../controllers/message.controller');


const router = express.Router();


router.route('/')
        .post(authenticate,checkMessagePermission,createMessage);

router.post('/get',getMessages);
router.post('/group',authenticate,checkMessagePermission,getGroupMessages);




module.exports = router;