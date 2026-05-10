import {
  required,
  email,
  minLength,
  maxLength,
  pattern,
  phone,
  url,
  number,
  min,
  max,
  match,
  custom,
  combine,
  conditional,
} from './validationRules';

describe('Validation Rules', () => {
  describe('required', () => {
    it('should return error for empty string', () => {
      const validator = required('Field is required');
      expect(validator('')).toBe('Field is required');
    });

    it('should return error for null', () => {
      const validator = required();
      expect(validator(null)).toBeTruthy();
    });

    it('should return null for non-empty string', () => {
      const validator = required();
      expect(validator('value')).toBeNull();
    });

    it('should return null for whitespace-trimmed non-empty string', () => {
      const validator = required();
      expect(validator('  value  ')).toBeNull();
    });
  });

  describe('email', () => {
    it('should return error for invalid email', () => {
      const validator = email();
      expect(validator('invalid-email')).toBeTruthy();
      expect(validator('user@')).toBeTruthy();
      expect(validator('@example.com')).toBeTruthy();
    });

    it('should return null for valid email', () => {
      const validator = email();
      expect(validator('user@example.com')).toBeNull();
      expect(validator('test.user@example.co.uk')).toBeNull();
    });

    it('should return null for empty value', () => {
      const validator = email();
      expect(validator('')).toBeNull();
    });

    it('should use custom message', () => {
      const validator = email('Invalid email format');
      expect(validator('invalid')).toBe('Invalid email format');
    });
  });

  describe('minLength', () => {
    it('should return error for string shorter than min', () => {
      const validator = minLength(5);
      expect(validator('abc')).toBeTruthy();
    });

    it('should return null for string equal to min', () => {
      const validator = minLength(5);
      expect(validator('abcde')).toBeNull();
    });

    it('should return null for string longer than min', () => {
      const validator = minLength(5);
      expect(validator('abcdef')).toBeNull();
    });

    it('should return null for empty value', () => {
      const validator = minLength(5);
      expect(validator('')).toBeNull();
    });
  });

  describe('maxLength', () => {
    it('should return error for string longer than max', () => {
      const validator = maxLength(5);
      expect(validator('abcdef')).toBeTruthy();
    });

    it('should return null for string equal to max', () => {
      const validator = maxLength(5);
      expect(validator('abcde')).toBeNull();
    });

    it('should return null for string shorter than max', () => {
      const validator = maxLength(5);
      expect(validator('abc')).toBeNull();
    });

    it('should return null for empty value', () => {
      const validator = maxLength(5);
      expect(validator('')).toBeNull();
    });
  });

  describe('pattern', () => {
    it('should return error for non-matching pattern', () => {
      const validator = pattern(/^\d+$/);
      expect(validator('abc')).toBeTruthy();
    });

    it('should return null for matching pattern', () => {
      const validator = pattern(/^\d+$/);
      expect(validator('12345')).toBeNull();
    });

    it('should return null for empty value', () => {
      const validator = pattern(/^\d+$/);
      expect(validator('')).toBeNull();
    });
  });

  describe('phone', () => {
    it('should return error for invalid phone', () => {
      const validator = phone();
      expect(validator('abc')).toBeTruthy();
      expect(validator('123')).toBeTruthy(); // Too short
    });

    it('should return null for valid phone', () => {
      const validator = phone();
      expect(validator('1234567890')).toBeNull();
      expect(validator('+1 (123) 456-7890')).toBeNull();
    });

    it('should return null for empty value', () => {
      const validator = phone();
      expect(validator('')).toBeNull();
    });
  });

  describe('url', () => {
    it('should return error for invalid URL', () => {
      const validator = url();
      expect(validator('not a url')).toBeTruthy();
      expect(validator('htp://invalid')).toBeTruthy();
    });

    it('should return null for valid URL', () => {
      const validator = url();
      expect(validator('https://example.com')).toBeNull();
      expect(validator('http://example.com/path')).toBeNull();
    });

    it('should return null for empty value', () => {
      const validator = url();
      expect(validator('')).toBeNull();
    });
  });

  describe('number', () => {
    it('should return error for non-numeric value', () => {
      const validator = number();
      expect(validator('abc')).toBeTruthy();
    });

    it('should return null for numeric value', () => {
      const validator = number();
      expect(validator('123')).toBeNull();
      expect(validator('123.45')).toBeNull();
    });

    it('should return null for empty value', () => {
      const validator = number();
      expect(validator('')).toBeNull();
    });
  });

  describe('min', () => {
    it('should return error for value less than min', () => {
      const validator = min(10);
      expect(validator('5')).toBeTruthy();
    });

    it('should return null for value equal to min', () => {
      const validator = min(10);
      expect(validator('10')).toBeNull();
    });

    it('should return null for value greater than min', () => {
      const validator = min(10);
      expect(validator('15')).toBeNull();
    });

    it('should return null for empty value', () => {
      const validator = min(10);
      expect(validator('')).toBeNull();
    });
  });

  describe('max', () => {
    it('should return error for value greater than max', () => {
      const validator = max(10);
      expect(validator('15')).toBeTruthy();
    });

    it('should return null for value equal to max', () => {
      const validator = max(10);
      expect(validator('10')).toBeNull();
    });

    it('should return null for value less than max', () => {
      const validator = max(10);
      expect(validator('5')).toBeNull();
    });

    it('should return null for empty value', () => {
      const validator = max(10);
      expect(validator('')).toBeNull();
    });
  });

  describe('match', () => {
    it('should return error when values do not match', () => {
      const validator = match(() => 'password123');
      expect(validator('password456')).toBeTruthy();
    });

    it('should return null when values match', () => {
      const validator = match(() => 'password123');
      expect(validator('password123')).toBeNull();
    });

    it('should return null for empty value', () => {
      const validator = match(() => 'password123');
      expect(validator('')).toBeNull();
    });
  });

  describe('custom', () => {
    it('should return error when custom validator returns false', () => {
      const validator = custom((value) => value.length > 5);
      expect(validator('abc')).toBeTruthy();
    });

    it('should return null when custom validator returns true', () => {
      const validator = custom((value) => value.length > 5);
      expect(validator('abcdef')).toBeNull();
    });
  });

  describe('combine', () => {
    it('should return first error from combined validators', () => {
      const validator = combine(
        required('Required'),
        minLength(5, 'Min 5'),
        maxLength(10, 'Max 10')
      );

      expect(validator('')).toBe('Required');
      expect(validator('ab')).toBe('Min 5');
      expect(validator('abcdefghijk')).toBe('Max 10');
    });

    it('should return null when all validators pass', () => {
      const validator = combine(
        required(),
        minLength(5),
        maxLength(10)
      );

      expect(validator('abcde')).toBeNull();
    });
  });

  describe('conditional', () => {
    it('should apply validator when condition is true', () => {
      const validator = conditional(
        () => true,
        required('Required')
      );

      expect(validator('')).toBe('Required');
    });

    it('should not apply validator when condition is false', () => {
      const validator = conditional(
        () => false,
        required('Required')
      );

      expect(validator('')).toBeNull();
    });
  });

  describe('Complex Validation Scenarios', () => {
    it('should validate email with required and format checks', () => {
      const validator = combine(
        required('Email is required'),
        email('Invalid email format')
      );

      expect(validator('')).toBe('Email is required');
      expect(validator('invalid')).toBe('Invalid email format');
      expect(validator('user@example.com')).toBeNull();
    });

    it('should validate password with multiple rules', () => {
      const validator = combine(
        required('Password is required'),
        minLength(8, 'Password must be at least 8 characters'),
        pattern(/[A-Z]/, 'Password must contain uppercase letter'),
        pattern(/[0-9]/, 'Password must contain number')
      );

      expect(validator('')).toBe('Password is required');
      expect(validator('short')).toBe('Password must be at least 8 characters');
      expect(validator('lowercase123')).toBe('Password must contain uppercase letter');
      expect(validator('NoNumbers')).toBe('Password must contain number');
      expect(validator('Password123')).toBeNull();
    });

    it('should validate conditional fields', () => {
      const isOptional = () => false;
      const validator = conditional(
        isOptional,
        required('This field is required')
      );

      expect(validator('')).toBeNull();
    });
  });
});
