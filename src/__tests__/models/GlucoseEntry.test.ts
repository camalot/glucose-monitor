import GlucoseEntry from "../../models/GlucoseEntry";
import { UnitType } from "../../libs/Units";
import moment from "moment-timezone";

describe("GlucoseEntry Class", () => {
  it("should correctly initialize with given value, unit, and timestamp", () => {
    const value = 120;
    const unit = UnitType.MGDL;
    const timestamp = 1627849200; // Example timestamp
    const notes = "Fasting glucose";

    const entry = new GlucoseEntry(value, unit, timestamp, notes);

    expect(entry.value).toBe(value);
    expect(entry.unit).toBe(unit);
    expect(entry.timestamp).toBe(timestamp);
    expect(entry.notes).toBe(notes);
  });

  it("should use the default unit (MGDL) if no unit is provided", () => {
    const value = 100;
    const entry = new GlucoseEntry(value);

    expect(entry.unit).toBe(UnitType.MGDL);
  });

  it("should set the current timestamp if no timestamp is provided", () => {
    const value = 90;
    const entry = new GlucoseEntry(value);

    const currentTimestamp = moment().unix();
    expect(entry.timestamp).toBeGreaterThanOrEqual(currentTimestamp - 1); // Allow for slight timing differences
    expect(entry.timestamp).toBeLessThanOrEqual(currentTimestamp + 1);
  });

  it("should correctly parse the value as an integer", () => {
    const value = 105.7; // Float value
    const entry = new GlucoseEntry(value);

    expect(entry.value).toBe(105); // Should be parsed as an integer
  });

  it("should allow notes to be optional", () => {
    const value = 110;
    const entry = new GlucoseEntry(value);

    expect(entry.notes).toBeUndefined();
  });
});