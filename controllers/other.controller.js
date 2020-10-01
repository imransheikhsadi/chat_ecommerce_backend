const catchAsync = require("../utils/catchAsync.util");
const Other = require("../models/Others.model");
const AppError = require("../utils/appError.util");
const { SITE_PROPERTIES, COUPONS } = require("../utils/keys");
const filter = require("../utils/filterObj.util");
const { paypalCapture } = require("../utils/paypalCheckout");


exports.createDocument = catchAsync(async (req,res,next)=>{
    console.log(req.body)
    const document = await Other.create(req.body);

    if(!document) return next(new AppError('Failed To Create Document',500))

    res.status(200).json({
        status: 'success',
        document
    })
})

exports.getAllDocument = catchAsync(async (req,res,next)=>{
    const documents = await Other.find();

    if(!documents) return next(new AppError('Failed To Get Documents',500))

    res.status(200).json({
        status: 'success',
        documents
    })
});

exports.updateDocument = catchAsync(async (req,res,next)=>{
    const document = await Other.findByIdAndUpdate(req.params.id,req.body,{new: true});

    if(!document) return next(new AppError('Failed To Update Document',500))

    res.status(200).json({
        status: 'success',
        document
    })
});

exports.updateSiteProperties = catchAsync(async (req,res,next)=>{
    const siteProperties = await Other.findOneAndUpdate({key: SITE_PROPERTIES},req.body);

    res.status(200).json({
        status: 'success',
        siteProperties
    });
})

exports.getSiteProperties = catchAsync(async (req,res,next)=>{
    const siteProperties = await Other.findOne({key: SITE_PROPERTIES});
    console.log({SITE_PROPERTIES})

    if(!siteProperties)return next(new AppError('No Properties Found',404));

    res.status(200).json({
        status: 'success',
        siteProperties
    });
})

exports.getCoupons = catchAsync(async (req,res,next)=>{
    const doc = await Other.findOne({key: COUPONS});

    if(!doc)return next(new AppError('No Docs Found',404));

    res.status(200).json({
        status: 'success',
        doc
    });
})

exports.getCoupon = catchAsync(async (req,res,next)=>{
    console.log(req.body.code)
    const doc = await Other.findOne({
        coupons: {
            $elemMatch: {
                expiresIn: {$gte: (new Date()).toISOString()},
                code: req.body.code
            }
        }
    },{'coupons.$': 1});

    if(!doc)return next(new AppError('No Docs Found',404));

    res.status(200).json({
        status: 'success',
        doc
    });
})

exports.createCoupon = catchAsync(async (req,res,next)=>{
    const response = await Other.findOne({key: COUPONS});
    const codes = {...response._doc}.coupons.map(item=>item.code);

    if(codes.includes(req.body.code))return next(new AppError('Coupon Code Already Exist',400))

    const filteredData = filter(req.body,'code','expiresIn','limit','validFor','discount')
    const doc = await Other.findOneAndUpdate({key: COUPONS},{$push : {coupons: filteredData }},{new: true});

    if(!doc)return next(new AppError('No Docs Found',404));

    res.status(200).json({
        status: 'success',
        doc
    });
})

exports.deleteCoupon = catchAsync(async (req,res,next)=>{
    const doc = await Other.findOneAndUpdate({key: COUPONS},{$pull: {coupons: {code: req.body.code}}},{new: true});
   
    res.status(200).json({
        status: 'success',
        doc
    })
});

exports.paypalPaymentCapture = catchAsync(async (req,res,next)=>{
    if(!req.body.orderID)return next(new AppError('Bad request',400))
    const response = await paypalCapture(req.body.orderID);

    if(response.result.status !== 'COMPLETED')return next(new AppError('Failed To Capture Payment',400))


    res.status(200).json({
        status: 'success',
    })
})