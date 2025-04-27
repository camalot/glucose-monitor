"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const valueToArray_1 = __importDefault(require("../utility/valueToArray"));
const Serving_1 = __importDefault(require("./Serving"));
class Food {
    constructor(options) {
        // assign options to own properties
        Object.assign(this, options);
    }
    /**
    * @param {number} roundN - The number of decimals to round values to.
    **/
    computeServing(amount, roundN) {
        var _a;
        // get all servings with metric size units
        const metricServings = (_a = this.servings) === null || _a === void 0 ? void 0 : _a.filter(serving => serving.metricServingAmount);
        // if no metric servings, return
        if (!metricServings || metricServings.length === 0)
            return;
        // get first serving where metric units available
        const foundServing = metricServings === null || metricServings === void 0 ? void 0 : metricServings[0];
        // return computation for found serving
        return foundServing.computeServing(amount, roundN);
    }
    toJSON() {
        var _a;
        // return instance of Food
        return {
            id: this.id,
            name: this.name,
            type: this.type,
            brandName: this.brandName,
            url: this.url,
            // map servings to instance of Serving
            servings: (_a = this.servings) === null || _a === void 0 ? void 0 : _a.map((serving) => serving.toJSON())
        };
    }
    static fromJSON(object) {
        // ensure object isn't null or undefined
        object = object || {};
        // extract properties
        const id = object["id"];
        const name = object["name"];
        const type = object["type"];
        const url = object["url"];
        const brandName = object["brandName"];
        const servings = (object["servings"]) || [];
        // return instance of Food
        return new Food({
            id,
            name,
            type,
            brandName,
            url,
            // map servings to instance of Serving
            servings: (0, valueToArray_1.default)(servings)
                .map((serving) => Serving_1.default.fromJSON(serving))
        });
    }
    static fromResponse(object) {
        var _a;
        // ensure object isn't null or undefined
        object = object || {};
        // extract properties
        const id = object["food_id"];
        const name = object["food_name"];
        const type = object["food_type"];
        const url = object["food_url"];
        const brandName = object["brand_name"];
        const servings = ((_a = object["servings"]) === null || _a === void 0 ? void 0 : _a.serving) || [];
        // return instance of Food
        return new Food({
            id,
            name,
            type,
            brandName,
            url,
            // map servings to instance of Serving
            servings: (0, valueToArray_1.default)(servings)
                .map((serving) => Serving_1.default.fromResponse(serving))
        });
    }
}
exports.default = Food;
