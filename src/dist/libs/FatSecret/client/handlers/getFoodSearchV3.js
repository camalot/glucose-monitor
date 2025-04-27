"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFoodSearchV3Factory = getFoodSearchV3Factory;
const FoodSearchResultsV3_1 = __importDefault(require("../../structures/FoodSearchResultsV3"));
function getFoodSearchV3Factory(client) {
    // return function to send request
    return (params) => __awaiter(this, void 0, void 0, function* () {
        try {
            console.log("begin foods.search.v3");
            // send request
            const response = yield client.doRequest("foods.search.v3", {
                search_expression: decodeURIComponent(params.searchExpression),
                page_number: params.pageNumber,
                max_results: params.maxResults,
                region: params.region,
                language: params.language
            });
            console.log(response.data.foods_search);
            // return search results as foodSearchResult object
            return FoodSearchResultsV3_1.default.fromResponse(response.data.foods_search);
        }
        catch (err) {
            console.log(err);
            // else, rethrow error
            throw err;
        }
    });
}
