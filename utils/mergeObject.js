function mergeObject(primary,obj) {
    const obj1 = {...primary}
    Object.keys(obj1).map(key=>{
        if(obj[key] && Array.isArray(obj[key])){
            obj[key].map((item)=>{
                obj1[key].push(item)
            })
        }
    })
    return obj1;
}

module.exports = mergeObject;