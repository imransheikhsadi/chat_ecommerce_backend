const Group = require("../models/Group.model");
const AppError = require("../utils/appError.util");
const catchAsync = require("../utils/catchAsync.util");

exports.createGroup = catchAsync(async(req,res,next)=>{
    req.body.admins = [req.user._id];
    const newGroup = await Group.create(req.body)
    if(!newGroup)return next(new AppError('Failed To Create Group',500))
    const group = await Group.findById(newGroup._id).populate({path: 'members',select: 'name avatar'})

    res.status(200).json({
        status: 'success',
        group
    })
});

exports.getAllGroup = catchAsync(async(req,res,next)=>{

    const groups = await Group.find().populate({path: 'members',select: 'name avatar'});

    if(!groups)return next(new AppError('Failed To get Group',500))

    res.status(200).json({
        status: 'success',
        groups
    })
});

exports.getGroup = catchAsync(async(req,res,next)=>{

    const group = await Group.findById(req.params.id);

    if(!group)return next(new AppError('No Group Found',500))

    res.status(200).json({
        status: 'success',
        group
    })
});

exports.joinGroup = catchAsync(async(req,res,next)=>{

    const group = await Group.findById(req.params.id);

    if(!group)return next(new AppError('No Group Found',500))

    res.status(200).json({
        status: 'success',
        group
    })
});


exports.leaveGroup = catchAsync(async(req,res,next)=>{

    const group = await Group.findById(req.params.id);

    if(!group)return next(new AppError('No Group Found',500))

    res.status(200).json({
        status: 'success',
        group
    })
});
