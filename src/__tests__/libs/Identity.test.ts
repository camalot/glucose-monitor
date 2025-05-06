import Identity from '../../libs/Identity';

describe('Identity Class', () => {
  describe('random', () => {
    it('should generate a random string of length 7', () => {
      const randomString = Identity.random();
      expect(randomString).toHaveLength(7);
      expect(typeof randomString).toBe('string');
    });

    it('should generate different random strings on consecutive calls', () => {
      const randomString1 = Identity.random();
      const randomString2 = Identity.random();
      expect(randomString1).not.toBe(randomString2);
    });
  });

  describe('md5Hash (private)', () => {
    it('should generate a valid MD5 hash', () => {
      const input = 'test';
      const md5Hash = (Identity as any).md5Hash(input); // Access private method
      expect(md5Hash).toBe('098f6bcd4621d373cade4e832627b4f6'); // Precomputed MD5 hash of "test"
    });
  });

  describe('sha256Hash (private)', () => {
    it('should generate a valid SHA-256 hash', () => {
      const input = 'test';
      const sha256Hash = (Identity as any).sha256Hash(input); // Access private method
      expect(sha256Hash).toBe(
        '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08'
      ); // Precomputed SHA-256 hash of "test"
    });
  });

  describe('generate', () => {
    it('should generate a SHA-256 hash from an entity', () => {
      const entity = { name: 'John', age: 30 };
      const hash = Identity.generate(entity);
      const expectedHash = (Identity as any).sha256Hash('John_30');
      expect(hash).toBe(expectedHash);
    });

    it('should handle empty entities gracefully', () => {
      const entity = {};
      const hash = Identity.generate(entity);
      const expectedHash = (Identity as any).sha256Hash('');
      expect(hash).toBe(expectedHash);
    });
  });

  describe('validate', () => {
    it('should return true for a valid hash', () => {
      const entity = { name: 'John', age: 30 };
      const hash = Identity.generate(entity);
      const isValid = Identity.validate(entity, hash);
      expect(isValid).toBe(true);
    });

    it('should return false for an invalid hash', () => {
      const entity = { name: 'John', age: 30 };
      const invalidHash = 'invalidhash';
      const isValid = Identity.validate(entity, invalidHash);
      expect(isValid).toBe(false);
    });

    it('should handle empty entities gracefully', () => {
      const entity = {};
      const hash = Identity.generate(entity);
      const isValid = Identity.validate(entity, hash);
      expect(isValid).toBe(true);
    });
  });
});