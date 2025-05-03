import crypto from 'crypto';

export default class Identity {
  static random(): string {
    return Math.random().toString(36).substring(2, 9);
  }

  private static md5Hash(input: string): string {
    return crypto.createHash('md5').update(input).digest('hex');
  }

  private static sha256Hash(input: string): string {
    return crypto.createHash('sha256').update(input).digest('hex');
  }

  static generate(entity: any): string {
    const values = Object.values(entity).join('_');
    const hash = this.sha256Hash(values);
    return hash;
  }

  static validate(input: any, hash: string): boolean {
    const vals = Object.values(input).join('_');
    const computedHash = this.sha256Hash(vals);
    return computedHash === hash;
  }
}