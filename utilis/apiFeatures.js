const Trip = require('./../models/tripModel');

class ApiFeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }

    filter() {
        //--Build the query--//

        //gets all query parameters and values using 
        //destructuring and instanciates them in an object

        const queryObject = {
            ...this.queryString
        };

        console.log(`initial qs: ${this.queryString}`);
        console.log(queryObject);

        //the values in the array are deleted from query Object

        const excludedFields = ['page', 'sort', 'limit', 'fields'];
        excludedFields.forEach(el => delete queryObject[el]);

        let finalQueryString = JSON.stringify(queryObject);

        // formats req.query into moongoose type adding $ to the 
        // subparameters example: gte into $gte
        // for queries of this sort: ?numOfChildren[gte]=2

        finalQueryString = finalQueryString.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

        console.log(finalQueryString);

        this.query = Trip.find(JSON.parse(finalQueryString));

        return this;
    }
}

module.exports = ApiFeatures;