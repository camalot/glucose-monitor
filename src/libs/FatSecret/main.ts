import { createUnit } from "mathjs";

import { APIErrorCode } from "./client/APIError";
import { Client } from "./client/Client";
import BarcodedFood from "./structures/BarcodeFood";
import Food from "./structures/Food";
import FoodSearchResults from "./structures/FoodSearchResults";
import Serving from "./structures/Serving";

// define the calorie
createUnit({
  calorie: {
    definition: "4.184J",
    prefixes: "short",
    aliases: ["cal"]
  }
});

export default {
  Client,
  APIErrorCode,

  Food,
  BarcodedFood,
  FoodSearchResults,
  Serving
}

export {
  APIErrorCode, BarcodedFood, Client, Food, FoodSearchResults,
  Serving
};