const Message = require("../models/Message.model");
const ApiFeatures = require("../utils/apiFeatures");
const AppError = require("../utils/appError.util");
const catchAsync = require("../utils/catchAsync.util");
const uploadImage = require("../utils/upload");

exports.createMessage = catchAsync(async (req, res, next) => {
    let message;

    req.body.createdBy = req.user.name;

    if(req.body.messageType === 'image'){
        const src = (await uploadImage(req.body.imageSrc)).secure_url
        if(!src)return next(new AppError('Failed to upload image',400))
        req.body.src = src;
        message = await Message.create(req.body);

    }else{
        message = await Message.create(req.body);
    }

    if (!message) return next(new AppError('Failed To create Message', 400));

    res.status(200).json({
        status: 'success',
        message
    });

});

exports.getMessages = catchAsync(async (req, res, next) => {
    const { from, to } = req.body;
    if (!from || !to) return next(new AppError('Bad request', 400))
    const features = new ApiFeatures(Message.find(
        {
            $and: [
                {$or: [ { from: from }, { to: from }]},
                {$or: [{ from: to }, { to: to }]}
            ]
            
        }
    ).sort({_id: -1}), req.query).filter().paginate();
    const messages = await features.query;

    if (!messages) return next(new AppError('Failed to get messages', 400))


    res.status(200).json({
        status: 'success',
        messages: messages.reverse()
    })

});

exports.getGroupMessages = catchAsync(async (req, res, next) => {
    const { from, to } = req.body;
    if (!to) return next(new AppError('Bad request', 400))
    const features = new ApiFeatures(Message.find(
        {to: to}
    ).sort({_id: -1}), req.query).filter().paginate();
    const messages = await features.query;

    if (!messages) return next(new AppError('Failed to get messages', 400))


    res.status(200).json({
        status: 'success',
        messages: messages.reverse()
    })

});