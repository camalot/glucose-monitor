import moment from "moment-timezone";
import {UnitType} from '../libs/Units';

export default class WeightEntry {
  value: number; 
  unit: UnitType;
  timestamp: number; 
  notes?: string;

  constructor(weight: number, unit: UnitType = UnitType.LB, timestamp?: number, notes?: string) {
    this.value = weight;
    this.timestamp = timestamp || moment().unix();
    this.unit = unit;
    this.notes = notes;
  }
}