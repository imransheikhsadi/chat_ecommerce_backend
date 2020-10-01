const mongoose = require("mongoose");
const Product = require("../models/Product.model");
const Review = require("../models/Reviews.model");
const AppError = require("../utils/appError.util");
const catchAsync = require("../utils/catchAsync.util");
const filter = require("../utils/filterObj.util");

exports.createReview = catchAsync(async(req,res,next)=>{
    const filteredData = filter(req.body,'rating','product','description')
    const oldReview = await Review.findOne({product: req.body.product,user: req.user._id})

    if(oldReview)return next(new AppError('Already have a review on this product',400))

    const review = await Review.create({...filteredData,user: req.user._id});
    Product.findByIdAndUpdate({_id: req.body.product},{$inc: {totalStar: req.body.rating,totalReview: 1}}).exec()
    

    res.status(200).json({
        status: 'success',
        review
    })
});

exports.getReviews = catchAsync(async(req,res,next)=>{

    const reviews = await Review.find({product: req.params.id}).populate({path: 'user',select: 'name avatar rating'})
    const stats = await Review.aggregate([
        {
            $match: {
                product: mongoose.Types.ObjectId(req.params.id)
            }
        },
        {
            $group: {
                _id: 'null',
                totalRating: { $sum: '$rating'},
                totalReview: { $sum: 1 }
            }
        },
        {
            $project: {
                _id: 0
            }
        }
    ])

    res.status(200).json({
        status: 'success',
        reviews: {
            ...stats[0],
            allReview: reviews
        }
    })
});