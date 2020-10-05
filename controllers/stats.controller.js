const Order = require("../models/Orders.model");
const AppError = require("../utils/appError.util");
const catchAsync = require("../utils/catchAsync.util");

exports.newOrders = catchAsync(async (req,res,next)=>{
    const stats = await Order.aggregate([
        {
            $match: {
                deliveryStatus: 'pending',
                orderedAt: {
                    $gte: new Date('2020-09-01'),
                    $lte: new Date()
                }
            }
        },
        {
            $group: {
                _id: 'null',
                newOrders: {
                    $sum: '$totalProduct'
                }
            }
        }
    ]);

    if(!stats[0].newOrders)return next(new AppError('Failed To get The Stats',404))



    res.status(200).json({
        status: 'success',
        newOrders: stats[0].newOrders
    })

});