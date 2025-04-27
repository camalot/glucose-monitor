"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Serving {
    constructor(data) {
        this.serving_id = data.serving_id;
        this.serving_description = data.serving_description;
        this.serving_url = data.serving_url;
        this.metric_serving_amount = parseFloat(data.metric_serving_amount);
        this.metric_serving_unit = data.metric_serving_unit;
        this.number_of_units = parseFloat(data.number_of_units);
        this.measurement_description = data.measurement_description;
        this.calories = parseFloat(data.calories);
        this.carbohydrate = parseFloat(data.carbohydrate);
        this.protein = parseFloat(data.protein);
        this.fat = parseFloat(data.fat);
        this.saturated_fat = parseFloat(data.saturated_fat);
        this.polyunsaturated_fat = parseFloat(data.polyunsaturated_fat);
        this.monounsaturated_fat = parseFloat(data.monounsaturated_fat);
        this.cholesterol = parseFloat(data.cholesterol);
        this.sodium = parseFloat(data.sodium);
        this.potassium = parseFloat(data.potassium);
        this.fiber = parseFloat(data.fiber);
        this.sugar = parseFloat(data.sugar);
        this.vitamin_a = parseFloat(data.vitamin_a);
        this.vitamin_c = parseFloat(data.vitamin_c);
        this.calcium = parseFloat(data.calcium);
        this.iron = parseFloat(data.iron);
    }
}
exports.default = Serving;
