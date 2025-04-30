import config from '../config'
import moment from 'moment-timezone';

export enum Timeframe {
  ONE_DAY = '1d',
  SEVEN_DAYS = '7d',
  FOURTEEN_DAYS = '14d',
  THIRTY_DAYS = '30d',
  NINETY_DAYS = '90d',
  ONE_HUNDRED_TWENTY_DAYS = '120d',
  ONE_HUNDRED_FIFTY_DAYS = '150d',
  ONE_HUNDRED_EIGHTY_DAYS = '180d',
  THREE_SIXTY_FIVE_DAYS = '365d',
  ALL_TIME = '~'
}

export default class Time {
  static DEFAULT_TIMEZONE = config.timezone;
  
  static toUnixTime(dateTime: Date): number {
    let utcDateTime;
    // check if dateTime is UTC
    if (dateTime.getTimezoneOffset() !== 0) {
      // convert dateTime to UTC time
      utcDateTime = new Date(dateTime.toUTCString());
    } else {
      utcDateTime = dateTime;
    }
    return moment(utcDateTime).unix();
  }
  static fromUnixTime(unixTime: number): moment.Moment {
    return moment.unix(unixTime);
  }

  private static convertTimeframeToOffset(timeframe: Timeframe): number {
    switch (timeframe) {
      case Timeframe.ONE_DAY:
        return 1;
      case Timeframe.SEVEN_DAYS:
        return 7;
      case Timeframe.FOURTEEN_DAYS:
        return 14;
      case Timeframe.THIRTY_DAYS:
        return 30;
      case Timeframe.NINETY_DAYS:
        return 90;
      case Timeframe.ONE_HUNDRED_TWENTY_DAYS:
        return 120;
      case Timeframe.ONE_HUNDRED_FIFTY_DAYS:
        return 150;
      case Timeframe.ONE_HUNDRED_EIGHTY_DAYS:
        return 180;
      case Timeframe.THREE_SIXTY_FIVE_DAYS:
        return 365;
      case Timeframe.ALL_TIME:
        return Number.MAX_SAFE_INTEGER;
      default:
        throw new Error('Invalid timeframe');
    }
  }

  static subtractTimeframe(timeframe: Timeframe, date: Date): moment.Moment {
    const offset = this.convertTimeframeToOffset(timeframe);
    return moment(date).subtract(offset, 'days');
  }
}
