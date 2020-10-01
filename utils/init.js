const Other = require("../models/Others.model");
const catchAsync = require("./catchAsync.util");
const { SITE_PROPERTIES, COUPONS } = require("./keys");






const init = ()=> {
    Other.findOne({key: SITE_PROPERTIES},(_,doc)=>{
        if(!doc){
            Other.create({
                key: SITE_PROPERTIES,
                catagories: [],
                sizes: [],
                productTypes: [],
                defaultTheme: 'light'
            })
        }
    });
    Other.findOne({key: COUPONS},(_,doc)=>{
        if(!doc){
            Other.create({
                key: COUPONS,
                coupons: []
            })
        }
    });
    
}

module.exports = init;
