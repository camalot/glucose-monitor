import DatabaseMongoClient from './Database'
import FoodEntry from '../../models/FoodEntry';

export default class FoodMongoClient extends DatabaseMongoClient<FoodEntry> {

  constructor() {
    super();
    this.collectionName = 'foods';
    console.log("FoodMongoClient initialized");
  }



}
