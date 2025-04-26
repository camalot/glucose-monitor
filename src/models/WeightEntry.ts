import Time from "../libs/time";

export default class WeightEntry {
  id?: string; 
  value: number; 
  timestamp: number; 

  constructor(weight: number, timestamp?: number, id?: string) {
    this.value = weight;
    this.timestamp = timestamp || Time.toUnixTime(new Date());
    this.id = id;
  }
}