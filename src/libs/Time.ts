import config from '../config'
import moment from 'moment-timezone';

export enum Timeframe {
  TODAY = '0d',
  ONE_DAY = '1d',
  SEVEN_DAYS = '7d',
  FOURTEEN_DAYS = '14d',
  THIRTY_DAYS = '30d',
  NINETY_DAYS = '90d',
  FOUR_MONTHS = '120d',
  FIVE_MONTHS = '150d',
  SIX_MONTHS = '180d',
  NINE_MONTHS = '270d',
  ONE_YEAR = '365d',
  TWO_YEARS = '730d',
  ALL_TIME = '~'
}

export default class Time {
  static DEFAULT_TIMEZONE = config.timezone;

  private static convertTimeframeToOffset(timeframe: Timeframe): number {
    switch (timeframe) {
      case Timeframe.TODAY:
        return 0;
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
      case Timeframe.FOUR_MONTHS:
        return 120;
      case Timeframe.FIVE_MONTHS:
        return 150;
      case Timeframe.SIX_MONTHS:
        return 180;
      case Timeframe.NINE_MONTHS:
        return 270;
      case Timeframe.ONE_YEAR:
        return 365;
      case Timeframe.TWO_YEARS:
        return 730;
      case Timeframe.ALL_TIME:
        return moment().diff(moment.unix(0), 'days');
      default:
        throw new Error('Invalid timeframe');
    }
  }

  // static startOfDay(date: Date): moment.Moment {
  //   return moment(date).startOf('day');
  // }

  // static endOfDay(date: Date): moment.Moment {
  //   return moment(date).endOf('day');
  // }

  static subtractTimeframe(timeframe: Timeframe, date: Date): moment.Moment {
    const offset = this.convertTimeframeToOffset(timeframe);
    return moment(date).startOf('day').subtract(offset, 'days');
  }
}
