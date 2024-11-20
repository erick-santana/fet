import { useState, useCallback } from 'react';
import * as Yup from 'yup';
import { validate, ValidationResult } from '../utils/validation';

interface FormState<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
}

interface UseFormProps<T> {
  initialValues: T;
  validationSchema?: Yup.ObjectSchema<any>;
  onSubmit: (values: T) => Promise<void> | void;
}

interface UseFormReturn<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isSubmitting: boolean;
  handleChange: (field: keyof T) => (value: any) => void;
  handleBlur: (field: keyof T) => () => void;
  handleSubmit: () => Promise<void>;
  setFieldValue: (field: keyof T, value: any) => void;
  setFieldError: (field: keyof T, error: string) => void;
  resetForm: () => void;
  isValid: boolean;
}

export const useForm = <T extends Record<string, any>>({
  initialValues,
  validationSchema,
  onSubmit,
}: UseFormProps<T>): UseFormReturn<T> => {
  const [formState, setFormState] = useState<FormState<T>>({
    values: initialValues,
    errors: {} as Record<keyof T, string>,
    touched: {} as Record<keyof T, boolean>,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateField = async (field: keyof T, value: any): Promise<string> => {
    if (!validationSchema) return '';

    try {
      await validationSchema.validateAt(field as string, { [field]: value });
      return '';
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        return error.message;
      }
      return 'Erro de validação';
    }
  };

  const handleChange = useCallback((field: keyof T) => (value: any) => {
    setFormState((prev) => ({
      ...prev,
      values: { ...prev.values, [field]: value },
      touched: { ...prev.touched, [field]: true },
    }));
  }, []);

  const handleBlur = useCallback((field: keyof T) => () => {
    setFormState(prev => ({
      ...prev,
      touched: { ...prev.touched, [field]: true },
    }));
  }, []);

  const validateForm = async (): Promise<ValidationResult> => {
    if (!validationSchema) return { isValid: true, errors: {} };
    return validate(validationSchema, formState.values);
  };

  const handleSubmit = async (): Promise<void> => {
    setIsSubmitting(true);
    try {
      const validation = await validateForm();
      if (!validation.isValid) {
        setFormState(prev => ({
          ...prev,
          errors: validation.errors as Record<keyof T, string>,
          touched: Object.keys(prev.values).reduce((acc, key) => ({
            ...acc,
            [key]: true,
          }), {} as Record<keyof T, boolean>),
        }));
        return;
      }
      await onSubmit(formState.values);
    } finally {
      setIsSubmitting(false);
    }
  };

  const setFieldValue = useCallback((field: keyof T, value: any) => {
    setFormState(prev => ({
      ...prev,
      values: { ...prev.values, [field]: value },
    }));
  }, []);

  const setFieldError = useCallback((field: keyof T, error: string) => {
    setFormState(prev => ({
      ...prev,
      errors: { ...prev.errors, [field]: error },
    }));
  }, []);

  const resetForm = useCallback(() => {
    setFormState({
      values: initialValues,
      errors: {} as Record<keyof T, string>,
      touched: {} as Record<keyof T, boolean>,
    });
  }, [initialValues]);

  const isValid = Object.keys(formState.errors).length === 0;

  return {
    ...formState,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    setFieldError,
    resetForm,
    isValid,
  };
};