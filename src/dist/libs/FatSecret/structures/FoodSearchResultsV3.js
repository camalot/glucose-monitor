"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const valueToArray_1 = __importDefault(require("../utility/valueToArray"));
const Food_1 = __importDefault(require("./Food"));
class FoodSearchResultsV3 {
    constructor(options) {
        // assign options to own properties
        Object.assign(this, options);
    }
    static fromResponse(object) {
        // ensure object isn't null or undefined
        object = object || {};
        console.log(object);
        // extract properties
        const maxResults = parseInt(object["max_results"], 10);
        const pageNumber = parseInt(object["page_number"], 10);
        const totalResults = parseInt(object["total_results"], 10);
        const foods = (object['results']['food']) || [];
        console.log(foods);
        // return instance of FoodSearchResultsV3
        return new FoodSearchResultsV3({
            maxResults,
            pageNumber,
            totalResults,
            // map servings to instance of Serving
            foods: (0, valueToArray_1.default)(foods)
                .map((serving) => Food_1.default.fromResponse(serving))
        });
    }
}
exports.default = FoodSearchResultsV3;
