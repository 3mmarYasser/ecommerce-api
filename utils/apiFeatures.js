class ApiFeatures {
    constructor(mongooseQuery, queryString) {
        this.mongooseQuery = mongooseQuery;
        this.queryString = queryString;
    }
    filter(){
        const queryObj = {...this.queryString};
        const excludeFields = ["page","sort","limit","fields","keyword"];
        excludeFields.forEach(el => delete queryObj[el]);
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
        this.mongooseQuery = this.mongooseQuery.find({ ...JSON.parse(queryStr) });
        return this;
    }

    sort(){
        if(this.queryString.sort){
            const sortBy = this.queryString.sort.split(",").join(" ");
            this.mongooseQuery = this.mongooseQuery.sort(sortBy);
        }else {
            this.mongooseQuery = this.mongooseQuery.sort("-createdAt");
        }
        return this;
    }

    limitFields(){
        if(this.queryString.fields){
            const fields = this.queryString.fields.split(",").join(" ");
            this.mongooseQuery = this.mongooseQuery.select(fields);
        }else {
            this.mongooseQuery = this.mongooseQuery.select("-__v");
        }
        return this;
    }

    paginate(countDocuments){
        const page= this.queryString.page * 1||1;
        const limit =this.queryString.limit *1 ||50;
        const skip = (page-1) * limit;
        const endIdx = page * limit;
        const pagination = {};
        pagination.currentPage = page;
        pagination.limit = limit;
        pagination.numberOfPages = Math.ceil(countDocuments/limit);
        if(endIdx < countDocuments){
            pagination.nextPage = page+1;
        }
        if(skip > 0){
            pagination.prevPage = page-1;
        }

        this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);
        this.paginationResult = pagination;
        return this;
    }

    search(searchFields=["name"]){
        const searchFieldsArr = searchFields.map(
            field => ({[field]: {$regex: this.queryString.keyword, $options: "i"}})
        );
        if(this.queryString.keyword){
            this.mongooseQuery = this.mongooseQuery.find({
                $or: searchFieldsArr
            });
        }
        return this;
    }
    populate(options){
        this.mongooseQuery = this.mongooseQuery.populate(options);
        return this;
    }
}
module.exports = ApiFeatures;