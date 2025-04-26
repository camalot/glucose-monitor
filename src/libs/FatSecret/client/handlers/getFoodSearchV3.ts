import FoodSearchResults from "../../structures/FoodSearchResults";
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
      console.log("begin foods.search.v3");
      // send request
      const response = await client.doRequest("foods.search.v3", {
        search_expression: decodeURIComponent(params.searchExpression),
        page_number: params.pageNumber,

        max_results: params.maxResults,
        region: params.region,
        language: params.language
      });
      console.log(response.data.foods_search);
      // return search results as foodSearchResult object
      return FoodSearchResults.fromResponse(response.data?.foods_search?.results);
    } catch (err: unknown) {
      console.log(err);
      // else, rethrow error
      throw err;
    }
  }
}