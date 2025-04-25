import Time from "../libs/time";

export default class WeightEntry {
  id?: string; 
  value: number; 
  recordedAt: Date; 

  constructor(weight: number, recordedAt?: Date, id?: string) {
    this.value = weight;
    this.recordedAt = recordedAt || Time.toUtc(new Date());
    this.id = id;
  }
}