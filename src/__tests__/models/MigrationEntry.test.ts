import MigrationEntry from "../../models/MigrationEntry";
import moment from "moment-timezone";

describe("MigrationEntry Class", () => {
  it("should correctly initialize with given id, timestamp, and ran status", () => {
    const id = "migration_001";
    const timestamp = 1627849200; // Example timestamp
    const ran = true;

    const entry = new MigrationEntry(id, timestamp, ran);

    expect(entry.getId()).toBe(id);
    expect(entry.timestamp).toBe(timestamp);
    expect(entry.isRan()).toBe(ran);
  });

  it("should default 'ran' to true if not provided", () => {
    const id = "migration_002";
    const timestamp = 1627849200;

    const entry = new MigrationEntry(id, timestamp);

    expect(entry.isRan()).toBe(true);
  });

  it("should set the current timestamp if no timestamp is provided", () => {
    const id = "migration_003";
    const entry = new MigrationEntry(id);

    const currentTimestamp = moment().unix();
    expect(entry.timestamp).toBeGreaterThanOrEqual(currentTimestamp - 1); // Allow for slight timing differences
    expect(entry.timestamp).toBeLessThanOrEqual(currentTimestamp + 1);
  });

  it("should correctly handle Date objects as timestamps", () => {
    const id = "migration_004";
    const date = new Date("2023-01-01T00:00:00Z");
    const expectedTimestamp = moment(date).unix();

    const entry = new MigrationEntry(id, date);

    expect(entry.timestamp).toBe(expectedTimestamp);
  });

  it("should correctly update the 'ran' status", () => {
    const id = "migration_005";
    const entry = new MigrationEntry(id);

    entry.updateRanStatus(false);
    expect(entry.isRan()).toBe(false);

    entry.updateRanStatus(true);
    expect(entry.isRan()).toBe(true);
  });

  it("should correctly return the id", () => {
    const id = "migration_006";
    const entry = new MigrationEntry(id);

    expect(entry.getId()).toBe(id);
  });
});