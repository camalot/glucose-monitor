"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const time_1 = __importDefault(require("../libs/time"));
class MealEntry {
    constructor(name, description, calories, carbs, timestamp, fat, protein, sodium, cholesterol, notes, fatsecret_id, id) {
        this.name = name;
        this.description = description;
        this.calories = calories || -1;
        this.carbs = carbs || -1;
        this.timestamp = timestamp || time_1.default.toUnixTime(new Date());
        this.fat = fat || -1;
        this.protein = protein || -1;
        this.sodium = sodium || -1;
        this.cholesterol = cholesterol || -1;
        this.notes = notes || "";
        this.fatsecret_id = fatsecret_id || null;
        this.id = id;
    }
}
exports.default = MealEntry;
