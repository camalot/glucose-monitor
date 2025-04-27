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
exports.getFoodFactory = getFoodFactory;
const Food_1 = __importDefault(require("../../structures/Food"));
const APIError_1 = require("../APIError");
function getFoodFactory(client) {
    // return function to send request
    return (params) => __awaiter(this, void 0, void 0, function* () {
        try {
            // send request
            const response = yield client.doRequest("food.get.v4", {
                food_id: params.foodId,
                region: params.region,
                language: params.language
            });
            // return food as food object
            return Food_1.default.fromResponse(response.data["food"]);
        }
        catch (err) {
            // if couldn't find food because of invalid id return undefined
            if (err instanceof APIError_1.APIError && err.code === APIError_1.APIErrorCode.INVALID_ID)
                return;
            // else, rethrow error
            throw err;
        }
    });
}
