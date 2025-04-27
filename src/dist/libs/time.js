"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Time {
    static toUnixTime(dateTime) {
        let utcDateTime;
        // check if dateTime is UTC
        if (dateTime.getTimezoneOffset() !== 0) {
            // convert dateTime to UTC time
            utcDateTime = new Date(dateTime.toUTCString());
        }
        else {
            utcDateTime = dateTime;
        }
        return Math.floor(utcDateTime.getTime() / 1000);
    }
    static fromUnixTime(unixTime) {
        return new Date(unixTime * 1000);
    }
    static toUtc(date) {
        return new Date(date.getTime() + date.getTimezoneOffset() * 60000);
    }
    static formatDate(date) {
        return date.toISOString().split('T')[0];
    }
    static parseDate(dateString) {
        const parsedDate = new Date(dateString);
        if (isNaN(parsedDate.getTime())) {
            throw new Error('Invalid date string');
        }
        return parsedDate;
    }
}
exports.default = Time;
