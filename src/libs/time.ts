import config from '../config'

export default class Time {
  static DEFAULT_TIMEZONE = config.timezone;
  
  static toUnixTime(dateTime: Date) {
    let utcDateTime;
    // check if dateTime is UTC
    if (dateTime.getTimezoneOffset() !== 0) {
      // convert dateTime to UTC time
      utcDateTime = new Date(dateTime.toUTCString());
    } else {
      utcDateTime = dateTime;
    }
    return Math.floor(utcDateTime.getTime() / 1000);
  }
  static fromUnixTime(unixTime: number) {
    return new Date(unixTime * 1000);
  }

  static toUtc(date: Date) {
    return new Date(date.getTime() + date.getTimezoneOffset() * 60000);
  }

  static formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  static parseDate(dateString: string): Date {
    const parsedDate = new Date(dateString);
    if (isNaN(parsedDate.getTime())) {
      throw new Error('Invalid date string');
    }
    return parsedDate;
  }
}
