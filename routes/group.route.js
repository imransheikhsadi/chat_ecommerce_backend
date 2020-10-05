const express = require('express');
const { authenticate, checkModerator } = require('../controllers/auth.controller');
const { createGroup, getGroup, getAllGroup } = require('../controllers/group.controller');


const router = express.Router();


router.route('/')
        .get(getAllGroup)
        .post(authenticate,checkModerator,createGroup);

router.route('/:id')
        .get(getGroup);





module.exports = router;