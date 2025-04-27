"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Serving = exports.FoodSearchResults = exports.Food = exports.Client = exports.BarcodedFood = exports.APIErrorCode = void 0;
const mathjs_1 = require("mathjs");
const APIError_1 = require("./client/APIError");
Object.defineProperty(exports, "APIErrorCode", { enumerable: true, get: function () { return APIError_1.APIErrorCode; } });
const Client_1 = require("./client/Client");
Object.defineProperty(exports, "Client", { enumerable: true, get: function () { return Client_1.Client; } });
const BarcodeFood_1 = __importDefault(require("./structures/BarcodeFood"));
exports.BarcodedFood = BarcodeFood_1.default;
const Food_1 = __importDefault(require("./structures/Food"));
exports.Food = Food_1.default;
const FoodSearchResults_1 = __importDefault(require("./structures/FoodSearchResults"));
exports.FoodSearchResults = FoodSearchResults_1.default;
const Serving_1 = __importDefault(require("./structures/Serving"));
exports.Serving = Serving_1.default;
// define the calorie
(0, mathjs_1.createUnit)({
    calorie: {
        definition: "4.184J",
        prefixes: "short",
        aliases: ["cal"]
    }
});
exports.default = {
    Client: Client_1.Client,
    APIErrorCode: APIError_1.APIErrorCode,
    Food: Food_1.default,
    BarcodedFood: BarcodeFood_1.default,
    FoodSearchResults: FoodSearchResults_1.default,
    Serving: Serving_1.default
};
