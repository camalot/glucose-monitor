"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const FoodController_1 = __importDefault(require("../../../api/v1/controllers/FoodController"));
const express_1 = require("express");
const router = (0, express_1.Router)();
const foodController = new FoodController_1.default();
// requires premier scope.
router.route('/api/v1/food/autocomplete')
    .get((req, res, next) => {
    console.log("Received autocomplete request");
    foodController.autocomplete(req, res, next);
});
router.route('/api/v1/food/search/')
    .get((req, res, next) => {
    console.log("Received search request");
    foodController.search(req, res, next);
});
router.route('/api/v1/food/list/:count')
    .get((req, res, next) => {
    foodController.list(req, res, next);
});
// router.route('/api/v1/food/:id')
//   .get(foodController.getById);
exports.default = router;
