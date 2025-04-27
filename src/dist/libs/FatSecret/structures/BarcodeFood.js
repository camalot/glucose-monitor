"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BarcodeFood {
    constructor(options) {
        // assign options to own properties
        Object.assign(this, options);
    }
    // TODO: Add function to get barcode food -> food
    static fromResponse(object) {
        var _a;
        // ensure object isn't null or undefined
        object = object || {};
        // extract properties
        const id = (_a = object["food_id"]) === null || _a === void 0 ? void 0 : _a["value"];
        // return instance of Food
        return new BarcodeFood({
            id,
        });
    }
}
exports.default = BarcodeFood;
