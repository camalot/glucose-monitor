import Time from "../libs/time";

class GlucoseEntry {
  id?: string; // Optional unique identifier for the entry
  bloodGlucose: number; // Blood glucose value in mg/dL
  recordedAt: Date; // Date and time the entry was recorded

  constructor(bloodGlucose: number, recordedAt?: Date, id?: string) {
    this.bloodGlucose = bloodGlucose;
    this.recordedAt = recordedAt || Time.toUtc(new Date());
    this.id = id;
  }
}

export default GlucoseEntry; 
