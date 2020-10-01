class ApiFeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }

    filter() {
        const queryObj = { ...this.queryString };
        const excludeFields = ['page', 'sort', 'limit', 'fields', 'search','select'];
        excludeFields.forEach(field => delete queryObj[field]);

        let queryStr = JSON.stringify(queryObj);

        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

        this.query = this.query.find(JSON.parse(queryStr));

        return this
    }

    sort() {
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.split(',').join(' ')
            this.query = this.query.sort(sortBy)
        } else {
            this.query = this.query.sort('-price')
        }

        return this
    }

    paginate() {
        const page = this.queryString.page * 1 || 1;
        const limit = this.queryString.limit * 1 || 8;
        const skip = page * limit - limit;

        this.query = this.query.skip(skip).limit(limit);

        return this;
    }

    search() {
        const queryObj = { ...this.queryString };
        if (queryObj.search) {
            this.query = this.query.find({ $text: { $search: queryObj.search } }).select('name image price productCode')
        }

        return this
    }

    select() {
        if (this.queryString.select) {
            this.query = this.query.select(this.queryString.select.split(',').join(' '))
        }
        return this
    }
}


module.exports = ApiFeatures;