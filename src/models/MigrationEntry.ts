import moment from 'moment-timezone';

export default class MigrationEntry {
  id: string;
  timestamp: number;
  ran: boolean;

  constructor(id: string, timestamp?: number | Date, ran: boolean = true) {
    this.id = id;
    this.timestamp = typeof timestamp === 'number' ? timestamp : moment(timestamp).unix();
    this.ran = ran;
  }

  isRan(): boolean {
    return this.ran;
  }

  updateRanStatus(status: boolean): void {
    this.ran = status;
  }

  getId(): string {
    return this.id;
  }
}