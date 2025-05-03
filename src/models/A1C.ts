import { UnitType } from "../libs/Units";

export default class A1C {
  value: number;
  timestamp: number;
  unit: UnitType;

  constructor(value: number, timestamp: number) {
    this.value = value;
    this.timestamp = timestamp;
    this.unit = UnitType.PERCENT;
  }
  
}