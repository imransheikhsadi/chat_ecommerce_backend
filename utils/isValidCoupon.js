const isValidCoupon = (coupon, products) => {
    console.log(coupon,products)
    if(!coupon.code)return false;
    const { catagories, productTypes, brands, id } = coupon.validFor;

    if (coupon.validFor.all === 'All') {
        return true;
    }

    let isValid = [];

    products.map(item => {
        let productValid = false;
        if (catagories.includes(item.catagory)) {
            productValid = true
        }
        if (productTypes.includes(item.productType)) {
            productValid = true
        }
        if (brands.includes(item.brand)) {
            productValid = true
        }
        if (id.includes(item.productCode)) {
            productValid = true
        }
        isValid.push(productValid);
    });

    return !isValid.includes(false)
}

module.exports = isValidCoupon;
