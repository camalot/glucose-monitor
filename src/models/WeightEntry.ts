import moment from "moment-timezone";

export default class WeightEntry {
  value: number; 
  timestamp: number; 
  notes?: string;

  constructor(weight: number, timestamp?: number, notes?: string) {
    this.value = weight;
    this.timestamp = timestamp || moment().unix();
    this.notes = notes;
  }
}