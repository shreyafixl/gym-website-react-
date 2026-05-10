/**
 * Validation Rules Utilities
 * Provides reusable validation functions for form fields
 */

/**
 * Required field validation
 */
export const required = (message = 'This field is required') => {
  return (value) => {
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      return message;
    }
    return null;
  };
};

/**
 * Email validation
 */
export const email = (message = 'Please enter a valid email address') => {
  return (value) => {
    if (!value) return null;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return message;
    }
    return null;
  };
};

/**
 * Minimum length validation
 */
export const minLength = (min, message = `Minimum length is ${min} characters`) => {
  return (value) => {
    if (!value) return null;
    if (value.length < min) {
      return message;
    }
    return null;
  };
};

/**
 * Maximum length validation
 */
export const maxLength = (max, message = `Maximum length is ${max} characters`) => {
  return (value) => {
    if (!value) return null;
    if (value.length > max) {
      return message;
    }
    return null;
  };
};

/**
 * Pattern validation (regex)
 */
export const pattern = (regex, message = 'Invalid format') => {
  return (value) => {
    if (!value) return null;
    if (!regex.test(value)) {
      return message;
    }
    return null;
  };
};

/**
 * Phone number validation
 */
export const phone = (message = 'Please enter a valid phone number') => {
  return (value) => {
    if (!value) return null;
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    if (!phoneRegex.test(value) || value.replace(/\D/g, '').length < 10) {
      return message;
    }
    return null;
  };
};

/**
 * URL validation
 */
export const url = (message = 'Please enter a valid URL') => {
  return (value) => {
    if (!value) return null;
    try {
      new URL(value);
      return null;
    } catch {
      return message;
    }
  };
};

/**
 * Number validation
 */
export const number = (message = 'Please enter a valid number') => {
  return (value) => {
    if (!value) return null;
    if (isNaN(value)) {
      return message;
    }
    return null;
  };
};

/**
 * Minimum value validation
 */
export const min = (minValue, message = `Minimum value is ${minValue}`) => {
  return (value) => {
    if (value === null || value === undefined || value === '') return null;
    if (Number(value) < minValue) {
      return message;
    }
    return null;
  };
};

/**
 * Maximum value validation
 */
export const max = (maxValue, message = `Maximum value is ${maxValue}`) => {
  return (value) => {
    if (value === null || value === undefined || value === '') return null;
    if (Number(value) > maxValue) {
      return message;
    }
    return null;
  };
};

/**
 * Match field validation (for password confirmation, etc.)
 */
export const match = (getOtherValue, message = 'Fields do not match') => {
  return (value) => {
    if (!value) return null;
    if (value !== getOtherValue()) {
      return message;
    }
    return null;
  };
};

/**
 * Custom validation
 */
export const custom = (validatorFn, message = 'Invalid value') => {
  return (value) => {
    if (!validatorFn(value)) {
      return message;
    }
    return null;
  };
};

/**
 * Combine multiple validation rules
 */
export const combine = (...rules) => {
  return (value) => {
    for (const rule of rules) {
      const error = rule(value);
      if (error) return error;
    }
    return null;
  };
};

/**
 * Conditional validation
 */
export const conditional = (condition, rule) => {
  return (value) => {
    if (condition()) {
      return rule(value);
    }
    return null;
  };
};

/**
 * Common validation rule sets
 */
export const validationSets = {
  email: combine(required('Email is required'), email()),
  password: combine(
    required('Password is required'),
    minLength(8, 'Password must be at least 8 characters')
  ),
  name: combine(
    required('Name is required'),
    minLength(2, 'Name must be at least 2 characters'),
    maxLength(100, 'Name must not exceed 100 characters')
  ),
  phone: combine(
    required('Phone number is required'),
    phone()
  ),
  url: combine(
    required('URL is required'),
    url()
  ),
};

export default {
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
  validationSets,
};
