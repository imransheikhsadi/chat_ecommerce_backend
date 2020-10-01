const express = require('express');
const { signUp, signIn, authenticate, checkAdmin, signinWithGoogle, signinWithFacebook } = require('../controllers/auth.controller');
const { updateUser, updateAdmin, getAllUser, sendUser, forgetPassword, resetPassword, userSearch, getUser, getAllAdmin, updateProfilePicture } = require('../controllers/user.controller');


const router = express.Router();


router.route('/')
    .post(authenticate,sendUser)
    .get(authenticate,checkAdmin,userSearch)
    // .patch();

router.route('/:id')
    .get(authenticate,getUser)
    .patch(authenticate,updateUser)
    .patch(authenticate,updateUser)
    // .delete(/* Deactivate Certain user*/);

router.patch('/update-admin/:id',authenticate,checkAdmin,updateAdmin);
router.post('/signup',signUp);
router.post('/login',signIn);
router.post('/admins',authenticate,checkAdmin,getAllAdmin);
router.post('/forgetPassword',forgetPassword);
router.patch('/resetPassword/:token',resetPassword);
router.post('/signinWithGoogle',signinWithGoogle);
router.post('/signinWithFacebook',signinWithFacebook);
router.post('/updateProfilePicture',authenticate,updateProfilePicture);

module.exports = router;
