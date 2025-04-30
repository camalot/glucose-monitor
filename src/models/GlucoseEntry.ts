import moment from "moment-timezone";
import { UnitType } from '../libs/Units';

export default class GlucoseEntry {
  value: number; // Blood glucose value in mg/dL
  unit: UnitType;
  timestamp: number; // Date and time the entry was recorded
  notes?: string;

  constructor(value: number, unit: UnitType = UnitType.MGDL, timestamp?: number, notes?: string) {
    this.value = parseInt(value.toString());
    this.timestamp = timestamp || moment().unix();
    this.notes = notes;
  }
}
