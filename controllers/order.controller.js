const catchAsync = require("../utils/catchAsync.util");
const Order = require("../models/Orders.model");
const AppError = require("../utils/appError.util");
const ApiFeatures = require("../utils/apiFeatures");
const filter = require("../utils/filterObj.util");

exports.getOrders = catchAsync(async (req,res,next)=>{

    const features =  new ApiFeatures(Order.find(),req.query).filter().sort().paginate().select();
    const orders = await features.query;
    const count = await Order.countDocuments();

    if(!orders)return next(new AppError('Failed To Fatch Orders',500))

    res.status(200).json({
        status: 'success',
        total: count,
        orders
    })

});

exports.updateOrder = catchAsync(async (req,res,next)=>{

    const filteredBody  = filter(req.body,'deliveryStatus','paymentStatus')
    console.log({orderid: req.params.id})
    const order = await Order.findByIdAndUpdate(req.params.id,filteredBody,{new: true})    

    if(!order)return next(new AppError('Failed To Update Order',500))

    res.status(200).json({
        status: 'success',
        order
    })

});