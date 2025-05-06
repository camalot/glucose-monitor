import Reflection from '../../libs/Reflection';

describe('Reflection Class', () => {
  it('should return the name of the calling method', () => {
    function testCaller() {
      return Reflection.getCallingMethodName();
    }

    const result = testCaller();

    expect(result).toBe('testCaller');
  });

  it('should return "unknown" if it cannot match', () => {
    // Mock the Error object to simulate a missing stack trace
    jest.spyOn(global, 'Error').mockImplementation(() => {
      return { stack: "line one\nline two\nline three" } as unknown as Error;
    });

    const result = Reflection.getCallingMethodName();

    expect(result).toBe('unknown');

    // Restore the original Error implementation
    jest.restoreAllMocks();
  });

  it('should return "unknown" if the stack trace is unavailable', () => {
    // Mock the Error object to simulate a missing stack trace
    jest.spyOn(global, 'Error').mockImplementation(() => {
      return { stack: undefined } as unknown as Error;
    });

    const result = Reflection.getCallingMethodName();

    expect(result).toBe('unknown');

    // Restore the original Error implementation
    jest.restoreAllMocks();
  });

  it('should return "unknown" if the stack trace does not match the expected format', () => {
    // Mock the Error object to simulate an unexpected stack trace format
    jest.spyOn(global, 'Error').mockImplementation(() => {
      return { stack: 'invalid stack trace' } as unknown as Error;
    });

    const result = Reflection.getCallingMethodName();

    expect(result).toBe('unknown');

    // Restore the original Error implementation
    jest.restoreAllMocks();
  });
});