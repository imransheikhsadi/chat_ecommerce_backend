const express = require('express');
const { authenticate } = require('../controllers/auth.controller');
const { getMessages, createMessage } = require('../controllers/message.controller');


const router = express.Router();


router.route('/')
        .post(authenticate,createMessage);

router.post('/get',getMessages);




module.exports = router;