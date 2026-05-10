import { useState, useCallback } from 'react';

/**
 * Custom hook for form validation
 * Provides field-level and form-level validation with error tracking
 */
export const useFormValidation = (initialValues = {}, validationRules = {}) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Validate a single field
   */
  const validateField = useCallback((fieldName, fieldValue) => {
    const rules = validationRules[fieldName];
    if (!rules) return null;

    // Handle array of validation rules
    const ruleArray = Array.isArray(rules) ? rules : [rules];

    for (const rule of ruleArray) {
      if (typeof rule === 'function') {
        const error = rule(fieldValue);
        if (error) return error;
      } else if (rule.validate) {
        const error = rule.validate(fieldValue);
        if (error) return error;
      }
    }

    return null;
  }, [validationRules]);

  /**
   * Validate all fields
   */
  const validateForm = useCallback(() => {
    const newErrors = {};
    let isValid = true;

    Object.keys(validationRules).forEach((fieldName) => {
      const error = validateField(fieldName, values[fieldName]);
      if (error) {
        newErrors[fieldName] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [values, validationRules, validateField]);

  /**
   * Handle field change
   */
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;

    setValues((prev) => ({
      ...prev,
      [name]: fieldValue,
    }));

    // Clear error if field has been touched
    if (touched[name]) {
      const error = validateField(name, fieldValue);
      setErrors((prev) => ({
        ...prev,
        [name]: error,
      }));
    }
  }, [touched, validateField]);

  /**
   * Handle field blur
   */
  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));

    const error = validateField(name, values[name]);
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  }, [values, validateField]);

  /**
   * Set field value programmatically
   */
  const setFieldValue = useCallback((fieldName, fieldValue) => {
    setValues((prev) => ({
      ...prev,
      [fieldName]: fieldValue,
    }));
  }, []);

  /**
   * Set field error programmatically
   */
  const setFieldError = useCallback((fieldName, error) => {
    setErrors((prev) => ({
      ...prev,
      [fieldName]: error,
    }));
  }, []);

  /**
   * Set field touched status
   */
  const setFieldTouched = useCallback((fieldName, isTouched = true) => {
    setTouched((prev) => ({
      ...prev,
      [fieldName]: isTouched,
    }));
  }, []);

  /**
   * Reset form to initial values
   */
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  /**
   * Reset form with new values
   */
  const resetFormWithValues = useCallback((newValues) => {
    setValues(newValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, []);

  /**
   * Handle form submission
   */
  const handleSubmit = useCallback((onSubmit) => {
    return async (e) => {
      if (e && e.preventDefault) {
        e.preventDefault();
      }

      setIsSubmitting(true);
      const isValid = validateForm();

      if (isValid) {
        try {
          await onSubmit(values);
        } catch (error) {
          // Error handling is done by the caller
          throw error;
        } finally {
          setIsSubmitting(false);
        }
      } else {
        setIsSubmitting(false);
      }
    };
  }, [values, validateForm]);

  /**
   * Get field props for easy binding to input elements
   */
  const getFieldProps = useCallback((fieldName) => {
    return {
      name: fieldName,
      value: values[fieldName] || '',
      onChange: handleChange,
      onBlur: handleBlur,
    };
  }, [values, handleChange, handleBlur]);

  /**
   * Get field error if field has been touched
   */
  const getFieldError = useCallback((fieldName) => {
    return touched[fieldName] ? errors[fieldName] : null;
  }, [errors, touched]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    setFieldError,
    setFieldTouched,
    resetForm,
    resetFormWithValues,
    validateForm,
    validateField,
    getFieldProps,
    getFieldError,
  };
};

export default useFormValidation;
