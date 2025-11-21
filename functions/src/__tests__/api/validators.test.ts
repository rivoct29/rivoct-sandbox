import { describe, it, expect } from 'vitest';
import { isValidIndiaPhone, maskApiKey, assertIndiaPhone } from '../../shared/validators';

describe('Validators', () => {
  describe('isValidIndiaPhone', () => {
    it('should validate correct Indian phone numbers', () => {
      expect(isValidIndiaPhone('+919876543210')).toBe(true);
      expect(isValidIndiaPhone('+911234567890')).toBe(true);
    });

    it('should reject invalid phone formats', () => {
      expect(isValidIndiaPhone('9876543210')).toBe(false); // Missing +91
      expect(isValidIndiaPhone('+91987654321')).toBe(false); // Only 9 digits
      expect(isValidIndiaPhone('+9198765432100')).toBe(false); // 11 digits
      expect(isValidIndiaPhone('+910876543210')).toBe(false); // Starts with 0
    });

    it('should reject non-Indian country codes', () => {
      expect(isValidIndiaPhone('+12025551234')).toBe(false); // US number
      expect(isValidIndiaPhone('+447911123456')).toBe(false); // UK number
    });
  });

  describe('maskApiKey', () => {
    it('should mask API keys correctly', () => {
      const key = 'abcdef123456789';
      const masked = maskApiKey(key);
      expect(masked).toBe('abc****789');
      expect(masked).not.toContain('123456');
    });

    it('should handle short keys', () => {
      expect(maskApiKey('abc')).toBe('***');
      expect(maskApiKey('abcdef')).toBe('***');
    });

    it('should handle long keys', () => {
      const longKey = 'a'.repeat(50) + 'xyz';
      const masked = maskApiKey(longKey);
      expect(masked.startsWith('aaa')).toBe(true);
      expect(masked.endsWith('xyz')).toBe(true);
      expect(masked).toContain('****');
    });
  });

  describe('assertIndiaPhone', () => {
    it('should not throw for valid phone numbers', () => {
      expect(() => assertIndiaPhone('+919876543210')).not.toThrow();
    });

    it('should throw for invalid phone numbers', () => {
      expect(() => assertIndiaPhone('9876543210')).toThrow('India (+91)');
      expect(() => assertIndiaPhone('+910876543210')).toThrow('India (+91)');
    });
  });
});
