export interface GlucoseEntry {
  id?: string; // Optional unique identifier for the entry
  bloodGlucose: number; // Blood glucose value in mg/dL
  recordedAt: Date; // Date and time the entry was recorded
}

// Example of creating a new GlucoseEntry
export const createGlucoseEntry = (bloodGlucose: number, recordedAt: Date): GlucoseEntry => {
  return {
    bloodGlucose,
    recordedAt,
  };
};