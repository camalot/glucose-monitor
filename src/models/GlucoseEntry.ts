import Time from "../libs/time";

export default class GlucoseEntry {
  id?: string; // Optional unique identifier for the entry
  value: number; // Blood glucose value in mg/dL
  timestamp: number; // Date and time the entry was recorded
  notes?: string;

  constructor(value: number, timestamp?: number, notes?: string, id?: string) {
    this.value = parseInt(value.toString());
    this.timestamp = timestamp || Time.toUnixTime(new Date());
    this.notes = notes;
    this.id = id;
  }
}
