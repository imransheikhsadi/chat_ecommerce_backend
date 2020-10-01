function filter(obj,...fields) {
    const newObj = {};
    fields.forEach(field=>{
        if(obj[field]){
            newObj[field] = obj[field]
        }
    });

    return newObj;
}

module.exports = filter;