
export default class Reflection {
  static getCallingMethodName(): string {
    const error = new Error();
    const stack = error.stack ? error.stack.split('\n') : [];
    // Extract the second line of the stack trace (the caller)
    const callerLine = stack && stack.length > 2 ? stack[2] : '';
    if (callerLine) {
      const match = callerLine.match(/at (\w+)/);
      return match ? match[1] : 'unknown';
    }
    return 'unknown';
  }
}