import FoodSearchResultsV3 from "../../structures/FoodSearchResultsV3";
import BaseClient from "../BaseClient";

export function getFoodSearchV3Factory(client: BaseClient) {
  // return function to send request
  return async (params: {
    searchExpression?: string;
    pageNumber?: number;
    maxResults?: number;
    region?: string;
    language?: string;
  }) => {
    try {
      // send request
      const response = await client.doRequest("foods.search.v3", {
        search_expression: decodeURIComponent(params.searchExpression),
        page_number: params.pageNumber,

        max_results: params.maxResults,
        region: params.region,
        language: params.language
      });
      // return search results as foodSearchResult object
      return FoodSearchResultsV3.fromResponse(response.data.foods_search);
    } catch (err: unknown) {
      // else, rethrow error
      throw err;
    }
  }
}