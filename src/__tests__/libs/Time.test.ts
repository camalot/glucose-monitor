import Time, { Timeframe } from '../../libs/Time';
import moment from 'moment-timezone';

jest.mock('moment-timezone', () => {
  const moment = jest.requireActual('moment-timezone');
  moment.tz.setDefault = jest.fn();
  return moment;
});

describe('Time Class', () => {
  describe('convertTimeframeToOffset', () => {
    it('should return the correct offset for each timeframe', () => {
      expect(Time['convertTimeframeToOffset'](Timeframe.TODAY)).toBe(0);
      expect(Time['convertTimeframeToOffset'](Timeframe.ONE_DAY)).toBe(1);
      expect(Time['convertTimeframeToOffset'](Timeframe.SEVEN_DAYS)).toBe(7);
      expect(Time['convertTimeframeToOffset'](Timeframe.FOURTEEN_DAYS)).toBe(14);
      expect(Time['convertTimeframeToOffset'](Timeframe.THIRTY_DAYS)).toBe(30);
      expect(Time['convertTimeframeToOffset'](Timeframe.NINETY_DAYS)).toBe(90);
      expect(Time['convertTimeframeToOffset'](Timeframe.FOUR_MONTHS)).toBe(120);
      expect(Time['convertTimeframeToOffset'](Timeframe.FIVE_MONTHS)).toBe(150);
      expect(Time['convertTimeframeToOffset'](Timeframe.SIX_MONTHS)).toBe(180);
      expect(Time['convertTimeframeToOffset'](Timeframe.NINE_MONTHS)).toBe(270);
      expect(Time['convertTimeframeToOffset'](Timeframe.ONE_YEAR)).toBe(365);
      expect(Time['convertTimeframeToOffset'](Timeframe.TWO_YEARS)).toBe(730);
    });

    it('should calculate the correct offset for ALL_TIME', () => {
      const daysSinceEpoch = moment().diff(moment.unix(0), 'days');
      expect(Time['convertTimeframeToOffset'](Timeframe.ALL_TIME)).toBe(daysSinceEpoch);
    });

    it('should throw an error for an invalid timeframe', () => {
      expect(() => Time['convertTimeframeToOffset']('invalid' as Timeframe)).toThrow('Invalid timeframe');
    });
  });

  describe('subtractTimeframe', () => {
    it('should subtract the correct number of days for each timeframe', () => {
      const date = new Date('2025-01-01');
      const result = Time.subtractTimeframe(Timeframe.SEVEN_DAYS, date);
      expect(result.format('YYYY-MM-DD')).toBe(moment(date).startOf('day').subtract(7, 'days').format('YYYY-MM-DD'));
    });

    it('should handle ALL_TIME correctly', () => {
      const date = new Date('2025-01-01');
      const daysSinceEpoch = moment().diff(moment.unix(0), 'days');
      const result = Time.subtractTimeframe(Timeframe.ALL_TIME, date);
      expect(result.format('YYYY-MM-DD')).toBe(moment(date).startOf('day').subtract(daysSinceEpoch, 'days').format('YYYY-MM-DD'));
    });

    it('should throw an error for an invalid timeframe', () => {
      const date = new Date('2025-01-01');
      expect(() => Time.subtractTimeframe('invalid' as Timeframe, date)).toThrow('Invalid timeframe');
    });
  });

  describe('DEFAULT_TIMEZONE', () => {
    it('should use the default timezone from config', () => {
      expect(Time.DEFAULT_TIMEZONE).toBeDefined();
    });
  });
});