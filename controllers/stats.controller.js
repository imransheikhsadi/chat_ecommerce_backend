const Order = require("../models/Orders.model");
const Product = require("../models/Product.model");
const User = require("../models/User.model");
const AppError = require("../utils/appError.util");
const catchAsync = require("../utils/catchAsync.util");

const calculateDate = (dateAt,range)=>{
    if(range === 'day'){
        const dt = new Date(dateAt);
        return dt.setHours(0,0,0,0);
    }
    if(range === 'week'){
        const dt = new Date(dateAt);
        return dt.setDate(dt.getDate() - 7)
    }
    if(range === 'month'){
        const dt = new Date(dateAt);
        return new Date(`${dt.getFullYear()}-${dt.getMonth()}-1`)
    }
    if(range === 'year'){
        const dt = new Date(dateAt);
        return new Date(`${dt.getFullYear()}-01-01`)
    }
}

const mapDate = {
    year: '$month',
    month: '$dayOfMonth',
    week: '$dayOfWeek',
    day: '$hour'
}

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

exports.getMainStats = catchAsync(async (req,res,next)=>{
    const {point= new Date(),range = 'month'} = req.body;
    const incomeStat = await Order.aggregate([
        {
            $match: {
                paymentStatus: 'paid',
                orderedAt: {
                    $gte: new Date(calculateDate(point,range)),
                    $lte: new Date(point)
                }
            }
        },
        {
            $group: {
                _id: 'null',
                totalIncome: {
                    $sum: '$totalPrice'
                }
            }
        }
    ]);

    const orderStat = await Order.aggregate([
        {
            $match: {
                deliveryStatus: 'pending',
                orderedAt: {
                    $gte: new Date(calculateDate(point,range)),
                    $lte: new Date(point)
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

    const newUsers = await User.aggregate([
        {
            $match: {
                joinedAt: {
                    $gte: new Date(calculateDate(point,range)),
                    $lte: new Date(point)
                }
            }
        },
        {
            $group: {
                _id: 'null',
                new: { $sum: 1 }
            }
        }
    ]);

    // const newUserStat = await Order



    res.status(200).json({
        status: 'success',
        stats: {
            totalIncome: incomeStat[0].totalIncome,
            newOrders: orderStat[0].newOrders,
            newUsers: newUsers[0].new
        }
    })

});

exports.summary = catchAsync(async(req,res,next)=>{

    const {point,range} = req.body;

    const sales = await Order.aggregate([
        {
            $match: {
                paymentStatus: 'paid',
                orderedAt: {
                    $gte: new Date(calculateDate(point,range)),
                    $lte: new Date(point)
                }
            }
        },
        {
            $group: {
                _id: {
                    [mapDate[range]]: '$orderedAt'
                },
                sale: {$sum: '$totalProduct'}
            }
        },
        {
            $sort: {
                _id: 1
            }
        }
    ]);

    const cost = await Product.aggregate([
        {
            $match: {
                createdAt: {
                    $gte: new Date(calculateDate(point,range)),
                    $lte: new Date(point)
                }
            }
        },
        {
            $group: {
                _id: {
                    [mapDate[range]]: '$createdAt'
                },
                cost: { $sum: '$basePrice' },
                quantity: { $sum : '$quantity' }
            }
        },
        {
            $project: {
                totalCost: { $multiply: ['$cost','$quantity'] }
            }
        },
        {
            $sort: {
                _id: 1
            }
        }
    ]);
    
    


    res.status(200).json({
        status: 'success',
        sales,
        cost
    })
});

exports.latestBayers = catchAsync(async(req,res,next)=>{

    const {point,range} = req.body;


    const bayers = await Order.aggregate([
    
        {
            $match: {
                orderedAt: {
                    $gte: new Date(calculateDate(point,range)),
                    $lte: new Date(point)
                }
            }
        },
      
        {
            $group: {
                _id: '$orderBy',
                orderedAt: { $last: '$orderedAt' },
            }
        },
        {
            $sort: {
                orderedAt: -1
            }
        },
        {
            $limit: 3
        },
        {
            $lookup: {
                from: 'users',
                localField: '_id',
                foreignField: '_id',
                as: 'user'
            }
        },
        {
            $project: {
                orderedAt: 1,
                user: { $arrayElemAt: ['$user',0] }
            }
        },
        {
            $project: {
                orderedAt: 1,
                name: '$user.name',
                avatar: '$user.avatar'
            }
        }
        
    ]);


    res.status(200).json({
        status: 'success',
        bayers
    })

});