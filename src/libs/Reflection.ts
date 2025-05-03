
export default class Reflection {
  static getCallingMethodName(): string {
    const error = new Error();
    const stack = error.stack?.split('\n');
    // Extract the second line of the stack trace (the caller)
    const callerLine = stack ? stack[2] : '';
    const match = callerLine.match(/at (\w+)/);
    return match ? match[1] : 'unknown';
  }
}