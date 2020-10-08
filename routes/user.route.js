const express = require('express');
const { signUp, signIn, authenticate, checkAdmin, signinWithGoogle, signinWithFacebook } = require('../controllers/auth.controller');
const { updateUser, updateAdmin, getAllUser, sendUser, forgetPassword, resetPassword, userSearch, getUser, getAllAdmin, updateProfilePicture, changePassword, deleteUser } = require('../controllers/user.controller');


const router = express.Router();


router.route('/')
    .post(authenticate,sendUser)
    .get(userSearch)

router.route('/:id')
    .get(authenticate,getUser)
    .patch(authenticate,updateUser)
    .delete(authenticate,checkAdmin,deleteUser)

router.patch('/update-admin/:id',authenticate,checkAdmin,updateAdmin);
router.post('/signup',signUp);
router.post('/login',signIn);
router.post('/admins',authenticate,checkAdmin,getAllUser);
router.post('/forgetPassword',forgetPassword);
router.patch('/resetPassword/:token',resetPassword);
router.post('/signinWithGoogle',signinWithGoogle);
router.post('/signinWithFacebook',signinWithFacebook);
router.post('/updateProfilePicture',authenticate,updateProfilePicture);
router.post('/changePassword',authenticate,changePassword);

module.exports = router;
