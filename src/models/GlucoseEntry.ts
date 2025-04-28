import moment from "moment-timezone";

export default class GlucoseEntry {
  value: number; // Blood glucose value in mg/dL
  timestamp: number; // Date and time the entry was recorded
  notes?: string;

  constructor(value: number, timestamp?: number, notes?: string) {
    this.value = parseInt(value.toString());
    this.timestamp = timestamp || moment().unix();
    this.notes = notes;
  }
}
