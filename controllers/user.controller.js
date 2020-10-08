const catchAsync = require("../utils/catchAsync.util");
const User = require("../models/User.model");
const AppError = require("../utils/appError.util");
const filter = require("../utils/filterObj.util");
const sendEmail = require("../utils/email");
const crypto = require('crypto');
const createToken = require("../utils/createToken");
const ApiFeatures = require("../utils/apiFeatures");
const uploadImage = require("../utils/upload");



exports.getUser = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.params.id)

    if(!user)return next(new AppError('User not found',404))

    res.status(200).json({
        status: 'success',
        user
    })
});

exports.sendUser = catchAsync(async (req, res, next) => {


    res.status(200).json({
        status: 'success',
        token: req.userToken,
        user: req.user
    });
});

exports.getAllUser = catchAsync(async (req, res, next) => {
    const features =  new ApiFeatures( User.find(),req.query).filter().sort().paginate().select();
    const users = await features.query;

    res.status(200).json({
        status: 'success',
        users
    })
});

exports.getAllAdmin = catchAsync(async (req, res, next) => {
    const admins = await User.find({role: { $in: ['admin','worker']}});

    if(!admins) return next(new AppError('No admins found',404))

    res.status(200).json({
        status: 'success',
        admins
    })
});

exports.updateUser = catchAsync(async (req, res, next) => {
    const userData = filter(req.body, 'name', 'password', 'email');

    if(Object.keys(userData).length === 0)return next(new AppError('You can only change Name Password and Email',401))


    const updatedUser = await User.findByIdAndUpdate(req.params.id, userData, { new: true });

    if (!updatedUser) return next(new AppError('User not Found', 404));

    res.status(200).json({
        status: 'success',
        user: updatedUser
    })
});

exports.updateAdmin = catchAsync(async (req, res, next) => {
    const filteredObject = filter(req.body,'role');

    if(Object.keys(filteredObject).length === 0)return next(new AppError('You can only change role',401))

    const updatedAdmin = await User.findByIdAndUpdate(req.params.id, filteredObject, { new: true });

    if (!updatedAdmin) return next(new AppError('User not Found', 404));

    res.status(200).json({
        status: 'success',
        user: updatedAdmin
    })
});

exports.forgetPassword = catchAsync(async (req, res, next) => {
    const email = req.body.email;
    if (!email) return next(new AppError('Please Provide an Email', 400))

    const user = await User.findOne({ email })

    if (!user) return next(new AppError('This Email Does not exist', 404))

    const resetToken = user.createPasswordResetToken();
    await user.save({ validateModifiedOnly: true })

    const resetUrl = `${req.headers.origin}/resetPassword/${resetToken}`;
    const message = `Forgot your password? Submit a request with your new password at ${resetUrl}.\nif you did not forget your password then just ignore it.`;

    try {
        const response = await sendEmail({
            email: user.email,
            subject: 'Password reset token (valid for 30min)',
            message
        });

        res.status(200).json({
            status: 'success',
            message: 'Please Check your Email for Token'
        });

    } catch (error) {
        user.passwordResetToken = undefined;
        user.passwordResetExpire = undefined;
        await user.save({ validateModifiedOnly: true })

        return next(new AppError('Error,Sending Email.Trying again later',500))
    }


});

exports.resetPassword = catchAsync(async (req, res, next) => {
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpire: { $gt: Date.now() }
    });


    if(!user) return next(new AppError('Invalid Token or Token Expired',400))

    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpire = undefined;

    await user.save({ validateModifiedOnly: true })

    const token = createToken(user._id);
    res.status(200).json({
        status: 'success',
        token,
        user
    });

});



exports.changePassword = catchAsync(async (req, res, next) => {
    const {oldPassword,newPassword,confirmNewPassword} = req.body;
    if(!oldPassword || !newPassword || !confirmNewPassword)return next(new AppError('Bad request',400));


    const user = await User.findOne({ email: req.user.email }).select('+password');

    if (!user || !await user.checkPassword(oldPassword, user.password)) return next(new AppError('Incorrect Password', 401));
    
    user.password = newPassword;
    user.confirmPassword = confirmNewPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpire = undefined;

    await user.save({ validateModifiedOnly: true })

    res.status(200).json({
        status: 'success'
    });

});


exports.userSearch = catchAsync( async(req,res,next)=>{
    const features = new ApiFeatures(User.find(),req.query).search().select('name email avatar')
    const users    = await features.query;

    if(!users)return next(new AppError('Failed to get users',500))

    res.status(200).json({
        status: 'success',
        users
    })
});

exports.updateProfilePicture = catchAsync( async(req,res,next)=>{
    const img = req.body.newImage;
    if(!img)return next(new AppError('Please provide A valid Image',400));

    const url = (await uploadImage(img)).secure_url

    if(!url) return next(new AppError('Failed To Upload Image',500))

    const user = await User.findByIdAndUpdate(req.user._id,{avatar: url},{new: true})

    if(!user) return next(new AppError('Failed To Upload Image',500))




    res.status(200).json({
        status: 'success',
        user
    })
});


exports.deleteUser = catchAsync( async(req,res,next)=>{
    const user = await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
        status: 'success',
        user
    })
});