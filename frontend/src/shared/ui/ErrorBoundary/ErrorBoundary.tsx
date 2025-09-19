import { Component, ErrorInfo, ReactNode } from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';
import { Button } from '../Button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-main-dark flex items-center justify-center p-4">
          <div className="max-w-md w-full text-center">
            <FaExclamationTriangle className="text-6xl text-red-error mx-auto mb-6" />
            <h1 className="text-2xl font-heading text-text-light mb-4">
              Что-то пошло не так
            </h1>
            <p className="text-text-light/80 mb-6">
              Произошла неожиданная ошибка. Попробуйте обновить страницу или вернуться на главную.
            </p>
            <div className="flex gap-4 justify-center">
              <Button onClick={this.handleReload} variant="primary">
                Обновить страницу
              </Button>
              <Button onClick={this.handleGoHome} variant="secondary">
                На главную
              </Button>
            </div>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-text-light/60 hover:text-text-light">
                  Детали ошибки (только в разработке)
                </summary>
                <pre className="mt-2 p-4 bg-main-dark/50 rounded text-xs text-red-error overflow-auto">
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
