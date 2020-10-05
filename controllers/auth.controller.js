const catchAsync = require("../utils/catchAsync.util");
const User = require("../models/User.model");
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const createToken = require("../utils/createToken");
const AppError = require("../utils/appError.util");
const filter = require("../utils/filterObj.util");
const googleOAuth = require("../utils/googleOAuth");
const { default: fetch } = require("node-fetch");



exports.signUp = catchAsync(async (req, res, next) => {
    const userData = filter(req.body, 'name', 'password', 'email', 'confirmPassword')
    const newUser = await User.create(userData);

    if (!newUser) return next(new AppError('User Creation Failed', 400))

    newUser.password = undefined;

    const token = createToken(newUser._id);

    res.cookie('jwt', token, {
        expires: new Date(Date.now() + (1000 * 60 * 60)),
        sameSite: 'none',
        secure: true
    });

    res.status(200).json({
        status: 'success',
        token,
        user: newUser
    });
});


exports.signIn = catchAsync(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email }).select('+password');

    if (!user || !await user.checkPassword(req.body.password, user.password)) return next(new AppError('Incorrect Email or Password', 401));

    const token = createToken(user._id);
    user.password = undefined;

    res.cookie('jwt', token, {
        expires: new Date(Date.now() + (1000 * 60 * 60)),
        sameSite: 'none',
        secure: true
    });

    res.status(200).json({
        status: 'success',
        token,
        user
    });
});

exports.authenticate = catchAsync(async (req, res, next) => {
    const token = req.cookies.jwt;

    if (!token) return next(new AppError('Please login to access', 401));

    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    const currentUser = await User.findById(decoded.id);

    if (!currentUser) return next(new AppError('No User Found', 404));

    req.user = currentUser;
    req.userToken = token;

    next();

});

exports.checkAdmin = catchAsync(async (req, res, next) => {
    if (!req.user.role.includes('admin')) return next(new AppError('Only Admin Can Do this action', 401));
    next();
});

exports.checkModerator = catchAsync(async (req, res, next) => {
    if (!req.user.role.includes('moderator') && !req.user.role.includes('admin')) return next(new AppError('You Dont Have Permission To Do This Action', 401));
    next();
});

exports.signinWithGoogle = catchAsync(async (req, res, next) => {
    if (!req.body.code) return next(new AppError('Bad Request', 400));

    const profile = await googleOAuth.getGoogleProfileInfo(req.body.code);
    if (!profile) return next(new AppError('Failed To get User data', 500));


    const googleUser = {
        googleId: profile.sub,
        name: profile.name,
        email: profile.email,
        avatar: profile.picture
    }

    const user = await User.findOne({ email: googleUser.email });


    if (!user) return next(new AppError('No user Found', 404));


    const token = createToken(user._id);

    res.cookie('jwt', token, {
        expires: new Date(Date.now() + (1000 * 60 * 60)),
        sameSite: 'none',
        secure: true
    });

    res.status(200).json({
        status: 'success',
        token,
        user
    });
});

exports.signinWithFacebook = catchAsync(async(req,res,next)=>{
    const {userID,accessToken} = req.body;

    if(!userID || !accessToken)return next(new AppError('Failed To Login with Facebook',400));

    const fbUrl = `https://graph.facebook.com/v2.11/${userID}/?fields=id,name,email&access_token=${accessToken}`

    const response = await fetch(fbUrl,{
        method: 'GET'
    }).then(res=>res.json());
    


    if(!response.email)return next(new AppError('No Email Found In facebook account',404))

    const user = await User.findOne({ email: response.email });

    if (!user) return next(new AppError('No user Found, Please Register to continue', 404));

    const token = createToken(user._id);

    res.cookie('jwt', token, {
        expires: new Date(Date.now() + (1000 * 60 * 60)),
        sameSite: 'none',
        secure: true
    });

    res.status(200).json({
        status: 'success',
        token,
        user
    });
});


