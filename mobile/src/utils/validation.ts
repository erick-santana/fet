import * as Yup from 'yup';

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

// Generic validation function
export const validate = async (
  schema: Yup.AnySchema,
  data: any
): Promise<ValidationResult> => {
  try {
    await schema.validate(data, { abortEarly: false });
    return { isValid: true, errors: {} };
  } catch (error) {
    if (error instanceof Yup.ValidationError) {
      const errors = error.inner.reduce(
        (acc, curr) => ({
          ...acc,
          [curr.path || 'unknown']: curr.message,
        }),
        {}
      );
      return { isValid: false, errors };
    }
    return { isValid: false, errors: { unknown: 'Erro de validação desconhecido' } };
  }
};

// Common validation schemas
export const schemas = {
  // User related schemas
  user: {
    login: Yup.object({
      email: Yup.string()
        .email('Email inválido')
        .required('Email é obrigatório'),
      password: Yup.string()
        .min(6, 'Senha deve ter no mínimo 6 caracteres')
        .required('Senha é obrigatória'),
    }),

    register: Yup.object({
      name: Yup.string()
        .min(3, 'Nome deve ter no mínimo 3 caracteres')
        .required('Nome é obrigatório'),
      email: Yup.string()
        .email('Email inválido')
        .required('Email é obrigatório'),
      password: Yup.string()
        .min(6, 'Senha deve ter no mínimo 6 caracteres')
        .required('Senha é obrigatória'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password')], 'Senhas não conferem')
        .required('Confirmação de senha é obrigatória'),
      address: Yup.string()
        .min(10, 'Endereço deve ter no mínimo 10 caracteres')
        .required('Endereço é obrigatório'),
    }),

    forgotPassword: Yup.object({
      email: Yup.string()
        .email('Email inválido')
        .required('Email é obrigatório'),
    }),

    resetPassword: Yup.object({
      password: Yup.string()
        .min(6, 'Nova senha deve ter no mínimo 6 caracteres')
        .required('Nova senha é obrigatória'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password')], 'Senhas não conferem')
        .required('Confirmação de senha é obrigatória'),
    }),

    updateProfile: Yup.object({
      name: Yup.string()
        .min(3, 'Nome deve ter no mínimo 3 caracteres')
        .required('Nome é obrigatório'),
      currentPassword: Yup.string().when('newPassword', {
        is: (val: string) => val && val.length > 0,
        then: (schema) => schema.required('Senha atual é obrigatória'),
        otherwise: (schema) => schema,
      }),
      newPassword: Yup.string().min(6, 'Nova senha deve ter no mínimo 6 caracteres'),
    }),
  },

  // Product related schemas
  product: {
    create: Yup.object({
      name: Yup.string()
        .required('Nome é obrigatório')
        .max(160, 'Nome deve ter no máximo 160 caracteres'),
      description: Yup.string()
        .required('Descrição é obrigatória')
        .max(2000, 'Descrição deve ter no máximo 2000 caracteres'),
      price: Yup.number()
        .required('Preço é obrigatório')
        .min(0, 'Preço deve ser maior que zero'),
      category: Yup.string().required('Categoria é obrigatória'),
      quantity: Yup.number()
        .required('Quantidade é obrigatória')
        .min(0, 'Quantidade deve ser maior ou igual a zero'),
    }),
  },

  // Order related schemas
  order: {
    create: Yup.object({
      products: Yup.array()
        .of(Yup.string())
        .required('Produtos são obrigatórios')
        .min(1, 'Pedido deve ter pelo menos um produto'),
      payment: Yup.object()
        .required('Informações de pagamento são obrigatórias'),
    }),
  },
};

// Helper functions - Only these are being modified
export const validateEmail = (email: string): boolean => {
  try {
    const schema = Yup.string()
      .email('Email inválido')
      .required('Email é obrigatório');
    return schema.validateSync(email, { abortEarly: true }) ? true : false;
  } catch (error) {
    return false;
  }
};

export const validatePassword = (password: string): boolean => {
  try {
    const schema = Yup.string()
      .min(6, 'Senha deve ter no mínimo 6 caracteres')
      .required('Senha é obrigatória');
    return schema.validateSync(password, { abortEarly: true }) ? true : false;
  } catch (error) {
    return false;
  }
};

export const validateName = (name: string): boolean => {
  try {
    const schema = Yup.string()
      .min(3, 'Nome deve ter no mínimo 3 caracteres')
      .required('Nome é obrigatório');
    return schema.validateSync(name, { abortEarly: true }) ? true : false;
  } catch (error) {
    return false;
  }
};

export const validateProductImage = async (uri: string): Promise<ValidationResult> => {
  try {
    const response = await fetch(uri);
    const blob = await response.blob();
    
    if (blob.size > 1000000) { // 1MB limit
      return {
        isValid: false,
        errors: {
          image: 'Imagem deve ter menos de 1MB'
        }
      };
    }

    if (!blob.type.startsWith('image/')) {
      return {
        isValid: false,
        errors: {
          image: 'Arquivo deve ser uma imagem'
        }
      };
    }

    return {
      isValid: true,
      errors: {}
    };
  } catch (error) {
    return {
      isValid: false,
      errors: {
        image: 'Erro ao validar imagem'
      }
    };
  }
};

export default {
  validate,
  schemas,
  validateEmail,
  validatePassword,
  validateName,
  validateProductImage,
};