const catchAsync = require("../utils/catchAsync.util");
const Other = require("../models/Others.model");
const AppError = require("../utils/appError.util");
const { SITE_PROPERTIES } = require("../utils/keys");
const { paypalCapture } = require("../utils/paypalCheckout");

exports.updateSiteProperties = catchAsync(async (req,res,next)=>{
    const siteProperties = await Other.findOneAndUpdate({key: SITE_PROPERTIES},req.body);

    res.status(200).json({
        status: 'success',
        siteProperties
    });
})

exports.getSiteProperties = catchAsync(async (req,res,next)=>{
    const siteProperties = await Other.findOne({key: SITE_PROPERTIES});

    if(!siteProperties)return next(new AppError('No Properties Found',404));

    res.status(200).json({
        status: 'success',
        siteProperties
    });
})


exports.paypalPaymentCapture = catchAsync(async (req,res,next)=>{
    if(!req.body.orderID)return next(new AppError('Bad request',400))
    const response = await paypalCapture(req.body.orderID);

    if(response.result.status !== 'COMPLETED')return next(new AppError('Failed To Capture Payment',400))


    res.status(200).json({
        status: 'success',
    })
})