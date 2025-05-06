import { createUnit } from "mathjs";

import { APIErrorCode } from "./client/APIError";
import { Client } from "./client/Client";
import BarcodedFood from "./structures/BarcodeFood";
import Food from "./structures/Food";
import FoodSearchResults from "./structures/FoodSearchResults";
import Serving from "./structures/Serving";
import { ICredentials } from "./client/BaseClient";

// // define the calorie
// createUnit({
//   calorie: {
//     definition: "4.184J",
//     prefixes: "short",
//     aliases: ["cal", "kcal", "calories"]
//   },
//   // mmol/L
//   // mmoll: {

//   //   definition: "1mmol/L = 18.015g/L",
//   //   prefixes: "short",
//   //   aliases: ["mmol", "millimoles"]
//   // },
//   // mg/dL
// });

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
  Serving, ICredentials
};