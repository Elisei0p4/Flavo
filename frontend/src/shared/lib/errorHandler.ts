import { AxiosError } from 'axios';
import * as Sentry from '@sentry/react';

interface DRFError {
  [key: string]: string[] | string;
}

interface ErrorContext {
  [key: string]: string | undefined;
  component?: string;
  action?: string;
  userId?: string;
  timestamp?: string;
}

export const getErrorMessages = (error: unknown, context?: ErrorContext): Record<string, string> => {
  const errors: Record<string, string> = {};


  if (context) {
    Sentry.setContext('error_context', context);
  }

  if (error instanceof AxiosError && error.response?.data) {
    const errorData = error.response.data;
    

    Sentry.addBreadcrumb({
      message: `HTTP Error: ${error.response.status}`,
      level: 'error',
      data: {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response.status,
        responseData: errorData,
      },
    });
    
    if (typeof errorData.detail === 'string') {
      errors.non_field_errors = errorData.detail;
      return errors;
    }

    if (typeof errorData === 'object' && errorData !== null) {
      for (const key in errorData) {
        if (Object.prototype.hasOwnProperty.call(errorData, key)) {
          const messages = (errorData as DRFError)[key];
          if (Array.isArray(messages) && messages.length > 0) {
            errors[key] = messages[0];
          } else if (typeof messages === 'string') {
            errors[key] = messages;
          }
        }
      }
      return errors;
    }
  }

  console.error('An unknown error occurred:', error);
  

  Sentry.captureException(error, {
    tags: {
      error_type: 'unknown_error',
      component: context?.component || 'unknown',
    },
    extra: {
      context,
      error_message: error instanceof Error ? error.message : String(error),
      error_stack: error instanceof Error ? error.stack : undefined,
    },
  });

  errors.non_field_errors = 'Произошла неизвестная ошибка.';
  return errors;
};

export const getErrorMessage = (error: unknown, context?: ErrorContext): string => {
  const errors = getErrorMessages(error, context);
  return Object.values(errors)[0] || 'Произошла неизвестная ошибка.';
};


export const handleApiError = (error: unknown, context?: ErrorContext): string => {
  if (error instanceof AxiosError) {
    switch (error.response?.status) {
      case 400:
        return 'Некорректные данные запроса.';
      case 401:
        return 'Необходима авторизация.';
      case 403:
        return 'Недостаточно прав для выполнения операции.';
      case 404:
        return 'Запрашиваемый ресурс не найден.';
      case 422:
        return getErrorMessage(error, context);
      case 429:
        return 'Слишком много запросов. Попробуйте позже.';
      case 500:
        return 'Внутренняя ошибка сервера.';
      case 502:
      case 503:
      case 504:
        return 'Сервер временно недоступен. Попробуйте позже.';
      default:
        return getErrorMessage(error, context);
    }
  }
  
  return getErrorMessage(error, context);
};


export const logError = (error: unknown, context?: ErrorContext): void => {
  const errorMessage = getErrorMessage(error, context);
  

  console.error('Error logged:', {
    message: errorMessage,
    error,
    context,
    timestamp: new Date().toISOString(),
  });
  

  Sentry.captureException(error, {
    tags: {
      error_type: 'logged_error',
      component: context?.component || 'unknown',
    },
    extra: {
      context,
      user_message: errorMessage,
    },
  });
};