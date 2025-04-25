import Food from "../../structures/Food";
import valueToArray from "../../utility/valueToArray";
import { APIError, APIErrorCode } from "../APIError";
import BaseClient from "../BaseClient"

export function getAutocompleteV2Factory(client: BaseClient) {
  // return function to send request
  return async (params: {
    expression: string;
    maxResults?: number;
    region?: string;
    language?: string;
  }) => {
    try {
      console.log("autocomplete.v2");
      // send request
      const response = await client.doRequest("foods.autocomplete.v2", {
        expression: params.expression,
        max_results: params.maxResults,
        region: params.region,
        language: params.language
      });

      // extract suggestions
      const suggestions = response.data["suggestions"]?.["suggestion"];

      // if no suggestions return
      if (!suggestions) return;

      // return suggestions transformed into array
      return valueToArray(suggestions);
    } catch (err: unknown) {
      // else, rethrow error
      throw err;
    }
  }
}