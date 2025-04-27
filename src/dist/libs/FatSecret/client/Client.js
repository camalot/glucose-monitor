"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Client = void 0;
const BaseClient_1 = __importDefault(require("./BaseClient"));
const getAutocomplete_1 = require("./handlers/getAutocomplete");
const getFood_1 = require("./handlers/getFood");
const getFoodFromBarcode_1 = require("./handlers/getFoodFromBarcode");
const getFoodSearchV1_1 = require("./handlers/getFoodSearchV1");
const getFoodSearchV2_1 = require("./handlers/getFoodSearchV2");
const getFoodSearchV3_1 = require("./handlers/getFoodSearchV3");
const getAutocompleteV2_1 = require("./handlers/getAutocompleteV2");
class Client extends BaseClient_1.default {
    constructor(options) {
        super(options);
        // handlers
        this.getFood = (0, getFood_1.getFoodFactory)(this);
        this.getFoodFromBarcode = (0, getFoodFromBarcode_1.getFoodFromBarcodeFactory)(this);
        this.getAutocomplete = (0, getAutocomplete_1.getAutocompleteFactory)(this);
        this.getAutocompleteV2 = (0, getAutocompleteV2_1.getAutocompleteV2Factory)(this);
        this.getFoodSearchV3 = (0, getFoodSearchV3_1.getFoodSearchV3Factory)(this);
        this.getFoodSearchV1 = (0, getFoodSearchV1_1.getFoodSearchV1Factory)(this);
        this.getFoodSearchV2 = (0, getFoodSearchV2_1.getFoodSearchV2Factory)(this);
    }
}
exports.Client = Client;
