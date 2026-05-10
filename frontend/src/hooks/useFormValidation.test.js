import { renderHook, act } from '@testing-library/react';
import useFormValidation from './useFormValidation';
import { required, email, minLength, combine } from '../utils/validationRules';

describe('useFormValidation', () => {
  describe('Basic Form Operations', () => {
    it('should initialize with provided values', () => {
      const initialValues = { name: 'John', email: 'john@example.com' };
      const { result } = renderHook(() =>
        useFormValidation(initialValues, {})
      );

      expect(result.current.values).toEqual(initialValues);
    });

    it('should initialize with empty values if not provided', () => {
      const { result } = renderHook(() => useFormValidation({}, {}));
      expect(result.current.values).toEqual({});
    });

    it('should handle field changes', () => {
      const { result } = renderHook(() =>
        useFormValidation({ name: '' }, {})
      );

      act(() => {
        result.current.handleChange({
          target: { name: 'name', value: 'John', type: 'text' },
        });
      });

      expect(result.current.values.name).toBe('John');
    });

    it('should handle checkbox changes', () => {
      const { result } = renderHook(() =>
        useFormValidation({ agree: false }, {})
      );

      act(() => {
        result.current.handleChange({
          target: { name: 'agree', checked: true, type: 'checkbox' },
        });
      });

      expect(result.current.values.agree).toBe(true);
    });
  });

  describe('Field Validation', () => {
    it('should validate required fields', () => {
      const validationRules = {
        name: required('Name is required'),
      };
      const { result } = renderHook(() =>
        useFormValidation({ name: '' }, validationRules)
      );

      act(() => {
        result.current.validateField('name', '');
      });

      const error = result.current.validateField('name', '');
      expect(error).toBe('Name is required');
    });

    it('should validate email format', () => {
      const validationRules = {
        email: email('Invalid email'),
      };
      const { result } = renderHook(() =>
        useFormValidation({ email: '' }, validationRules)
      );

      const error = result.current.validateField('email', 'invalid-email');
      expect(error).toBe('Invalid email');
    });

    it('should accept valid email', () => {
      const validationRules = {
        email: email(),
      };
      const { result } = renderHook(() =>
        useFormValidation({ email: '' }, validationRules)
      );

      const error = result.current.validateField('email', 'john@example.com');
      expect(error).toBeNull();
    });

    it('should validate minimum length', () => {
      const validationRules = {
        password: minLength(8),
      };
      const { result } = renderHook(() =>
        useFormValidation({ password: '' }, validationRules)
      );

      const error = result.current.validateField('password', 'short');
      expect(error).toBe('Minimum length is 8 characters');
    });

    it('should combine multiple validation rules', () => {
      const validationRules = {
        email: combine(
          required('Email is required'),
          email('Invalid email')
        ),
      };
      const { result } = renderHook(() =>
        useFormValidation({ email: '' }, validationRules)
      );

      let error = result.current.validateField('email', '');
      expect(error).toBe('Email is required');

      error = result.current.validateField('email', 'invalid');
      expect(error).toBe('Invalid email');

      error = result.current.validateField('email', 'valid@example.com');
      expect(error).toBeNull();
    });
  });

  describe('Form-Level Validation', () => {
    it('should validate entire form', () => {
      const validationRules = {
        name: required('Name is required'),
        email: email('Invalid email'),
      };
      const { result } = renderHook(() =>
        useFormValidation({ name: '', email: '' }, validationRules)
      );

      let isValid;
      act(() => {
        isValid = result.current.validateForm();
      });

      expect(result.current.errors.name).toBe('Name is required');
      expect(result.current.errors.email).toBe('Invalid email');
      expect(isValid).toBe(false);
    });

    it('should return true when form is valid', () => {
      const validationRules = {
        name: required(),
        email: email(),
      };
      const { result } = renderHook(() =>
        useFormValidation(
          { name: 'John', email: 'john@example.com' },
          validationRules
        )
      );

      let isValid;
      act(() => {
        isValid = result.current.validateForm();
      });

      expect(isValid).toBe(true);
      expect(result.current.errors).toEqual({});
    });
  });

  describe('Field Blur and Touch', () => {
    it('should mark field as touched on blur', () => {
      const { result } = renderHook(() =>
        useFormValidation({ name: '' }, {})
      );

      act(() => {
        result.current.handleBlur({ target: { name: 'name' } });
      });

      expect(result.current.touched.name).toBe(true);
    });

    it('should validate field on blur', () => {
      const validationRules = {
        name: required('Name is required'),
      };
      const { result } = renderHook(() =>
        useFormValidation({ name: '' }, validationRules)
      );

      act(() => {
        result.current.handleBlur({ target: { name: 'name' } });
      });

      expect(result.current.errors.name).toBe('Name is required');
    });

    it('should only show errors for touched fields', () => {
      const validationRules = {
        name: required('Name is required'),
        email: required('Email is required'),
      };
      const { result } = renderHook(() =>
        useFormValidation({ name: '', email: '' }, validationRules)
      );

      act(() => {
        result.current.handleBlur({ target: { name: 'name' } });
      });

      expect(result.current.getFieldError('name')).toBe('Name is required');
      expect(result.current.getFieldError('email')).toBeNull();
    });
  });

  describe('Form Submission', () => {
    it('should validate form before submission', async () => {
      const validationRules = {
        name: required('Name is required'),
      };
      const mockSubmit = jest.fn();
      const { result } = renderHook(() =>
        useFormValidation({ name: '' }, validationRules)
      );

      const handleSubmit = result.current.handleSubmit(mockSubmit);

      await act(async () => {
        await handleSubmit({ preventDefault: () => {} });
      });

      expect(mockSubmit).not.toHaveBeenCalled();
      expect(result.current.errors.name).toBe('Name is required');
    });

    it('should call submit function when form is valid', async () => {
      const validationRules = {
        name: required(),
      };
      const mockSubmit = jest.fn().mockResolvedValue({ success: true });
      const { result } = renderHook(() =>
        useFormValidation({ name: 'John' }, validationRules)
      );

      const handleSubmit = result.current.handleSubmit(mockSubmit);

      await act(async () => {
        await handleSubmit({ preventDefault: () => {} });
      });

      expect(mockSubmit).toHaveBeenCalledWith({ name: 'John' });
    });

    it('should set isSubmitting state during submission', async () => {
      const mockSubmit = jest.fn(
        () => new Promise((resolve) => setTimeout(resolve, 50))
      );
      const { result } = renderHook(() =>
        useFormValidation({ name: 'John' }, {})
      );

      const handleSubmit = result.current.handleSubmit(mockSubmit);

      const submitPromise = act(async () => {
        await handleSubmit({ preventDefault: () => {} });
      });

      await submitPromise;

      expect(result.current.isSubmitting).toBe(false);
      expect(mockSubmit).toHaveBeenCalled();
    });
  });

  describe('Form Reset', () => {
    it('should reset form to initial values', () => {
      const initialValues = { name: 'John', email: 'john@example.com' };
      const { result, rerender } = renderHook(
        ({ values }) => useFormValidation(values, {}),
        { initialProps: { values: initialValues } }
      );

      act(() => {
        result.current.handleChange({
          target: { name: 'name', value: 'Jane', type: 'text' },
        });
      });

      expect(result.current.values.name).toBe('Jane');

      act(() => {
        result.current.resetForm();
      });

      expect(result.current.values).toEqual(initialValues);
    });

    it('should clear errors and touched on reset', () => {
      const validationRules = {
        name: required(),
      };
      const { result } = renderHook(() =>
        useFormValidation({ name: '' }, validationRules)
      );

      act(() => {
        result.current.handleBlur({ target: { name: 'name' } });
      });

      expect(result.current.touched.name).toBe(true);
      expect(result.current.errors.name).toBeDefined();

      act(() => {
        result.current.resetForm();
      });

      expect(result.current.touched).toEqual({});
      expect(result.current.errors).toEqual({});
    });

    it('should reset form with new values', () => {
      const initialValues = { name: 'John' };
      const newValues = { name: 'Jane', email: 'jane@example.com' };
      const { result } = renderHook(() =>
        useFormValidation(initialValues, {})
      );

      act(() => {
        result.current.resetFormWithValues(newValues);
      });

      expect(result.current.values).toEqual(newValues);
    });
  });

  describe('Field Props Helper', () => {
    it('should return field props for input binding', () => {
      const { result } = renderHook(() =>
        useFormValidation({ name: 'John' }, {})
      );

      const props = result.current.getFieldProps('name');

      expect(props).toHaveProperty('name', 'name');
      expect(props).toHaveProperty('value', 'John');
      expect(props).toHaveProperty('onChange');
      expect(props).toHaveProperty('onBlur');
    });
  });

  describe('Programmatic Field Updates', () => {
    it('should set field value programmatically', () => {
      const { result } = renderHook(() =>
        useFormValidation({ name: '' }, {})
      );

      act(() => {
        result.current.setFieldValue('name', 'John');
      });

      expect(result.current.values.name).toBe('John');
    });

    it('should set field error programmatically', () => {
      const { result } = renderHook(() =>
        useFormValidation({ name: '' }, {})
      );

      act(() => {
        result.current.setFieldError('name', 'Custom error');
      });

      expect(result.current.errors.name).toBe('Custom error');
    });

    it('should set field touched status programmatically', () => {
      const { result } = renderHook(() =>
        useFormValidation({ name: '' }, {})
      );

      act(() => {
        result.current.setFieldTouched('name', true);
      });

      expect(result.current.touched.name).toBe(true);
    });
  });
});
