import FoodEntry from "./FoodEntry";

export class FoodSearchResults {
  totalResults: number;
  maxResults: number;
  pageNumber: number;
  totalPages: number;
  results: FoodEntry[];

  constructor(totalResults: number, maxResults: number, pageNumber: number, totalPages: number, results: FoodEntry[]) {
    this.totalResults = totalResults;
    this.maxResults = maxResults;
    this.pageNumber = pageNumber;
    this.totalPages = totalPages;
    this.results = results;
  }
}