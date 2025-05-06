import A1C from "../../models/A1C";
import { UnitType } from "../../libs/Units";

describe("A1C Class", () => {
  it("should correctly initialize with given value and timestamp", () => {
    const value = 5.6;
    const timestamp = 1627849200; // Example timestamp
    const a1c = new A1C(value, timestamp);

    expect(a1c.value).toBe(value);
    expect(a1c.timestamp).toBe(timestamp);
    expect(a1c.unit).toBe(UnitType.PERCENT);
  });

  it("should have the correct default unit as PERCENT", () => {
    const a1c = new A1C(6.2, 1627849200);
    expect(a1c.unit).toBe(UnitType.PERCENT);
  });
});
