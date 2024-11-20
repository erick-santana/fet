import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const formatCurrency = { 
  currency: (value: number): string => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  },

  // Date formatting
  date: {
    standard: (date: string | Date): string => {
      const parsedDate = typeof date === 'string' ? parseISO(date) : date;
      return format(parsedDate, 'dd/MM/yyyy', { locale: ptBR });
    },
    
    withTime: (date: string | Date): string => {
      const parsedDate = typeof date === 'string' ? parseISO(date) : date;
      return format(parsedDate, 'dd/MM/yyyy HH:mm', { locale: ptBR });
    },
    
    relative: (date: string | Date): string => {
      const parsedDate = typeof date === 'string' ? parseISO(date) : date;
      const now = new Date();
      const diffInHours = Math.floor((now.getTime() - parsedDate.getTime()) / (1000 * 60 * 60));
      
      if (diffInHours < 24) {
        if (diffInHours < 1) return 'Há alguns minutos';
        return `${diffInHours}h atrás`;
      }
      
      return format(parsedDate, 'dd/MM/yyyy', { locale: ptBR });
    }
  },

  // Text formatting
  text: {
    capitalize: (text: string): string => {
      return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
    },

    truncate: (text: string, length: number): string => {
      if (text.length <= length) return text;
      return text.slice(0, length) + '...';
    },

    phone: (phone: string): string => {
      const cleaned = phone.replace(/\D/g, '');
      const match = cleaned.match(/^(\d{2})(\d{5})(\d{4})$/);
      if (match) {
        return `(${match[1]}) ${match[2]}-${match[3]}`;
      }
      return phone;
    },

    cpf: (cpf: string): string => {
      const cleaned = cpf.replace(/\D/g, '');
      const match = cleaned.match(/^(\d{3})(\d{3})(\d{3})(\d{2})$/);
      if (match) {
        return `${match[1]}.${match[2]}.${match[3]}-${match[4]}`;
      }
      return cpf;
    }
  },

  // Number formatting
  number: {
    decimal: (value: number, decimals: number = 2): string => {
      return value.toFixed(decimals);
    },

    percentage: (value: number): string => {
      return `${(value * 100).toFixed(1)}%`;
    }
  }
};

export default formatCurrency;