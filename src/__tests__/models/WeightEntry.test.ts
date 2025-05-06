import WeightEntry from "../../models/WeightEntry";
import { UnitType } from "../../libs/Units";
import moment from "moment-timezone";

describe("WeightEntry Class", () => {
  it("should correctly initialize with given weight, unit, timestamp, and notes", () => {
    const weight = 150;
    const unit = UnitType.LB;
    const timestamp = 1627849200; // Example timestamp
    const notes = "Morning weight";

    const entry = new WeightEntry(weight, unit, timestamp, notes);

    expect(entry.value).toBe(weight);
    expect(entry.unit).toBe(unit);
    expect(entry.timestamp).toBe(timestamp);
    expect(entry.notes).toBe(notes);
  });

  it("should use the default unit (LB) if no unit is provided", () => {
    const weight = 70;
    const entry = new WeightEntry(weight);

    expect(entry.unit).toBe(UnitType.LB);
  });

  it("should set the current timestamp if no timestamp is provided", () => {
    const weight = 80;
    const entry = new WeightEntry(weight);

    const currentTimestamp = moment().unix();
    expect(entry.timestamp).toBeGreaterThanOrEqual(currentTimestamp - 1); // Allow for slight timing differences
    expect(entry.timestamp).toBeLessThanOrEqual(currentTimestamp + 1);
  });

  it("should allow notes to be optional", () => {
    const weight = 90;
    const entry = new WeightEntry(weight);

    expect(entry.notes).toBeUndefined();
  });

  it("should correctly handle a custom unit", () => {
    const weight = 100;
    const unit = UnitType.KG;

    const entry = new WeightEntry(weight, unit);

    expect(entry.unit).toBe(UnitType.KG);
  });
});