import Time from "../libs/time";

class GlucoseEntry {
  id?: string; // Optional unique identifier for the entry
  value: number; // Blood glucose value in mg/dL
  timestamp: number; // Date and time the entry was recorded

  constructor(value: number, timestamp?: number, id?: string) {
    this.value = value;
    this.timestamp = timestamp || Time.toUnixTime(new Date());
    this.id = id;
  }
}

export default GlucoseEntry; 
