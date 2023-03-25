import React, { ErrorInfo } from 'react';
import ErrorPage, { ErrorProps } from 'next/error';
import { ContainerWrapper } from '@marketplace/ui-kit';
import { LoaderProgress } from '../LoaderProgress';

export class PageError extends Error {
  statusCode?: number;

  title?: string;

  constructor(message?: string, code?: number) {
    super(message);
    this.title = message;
    this.statusCode = code;
  }
}

export interface WithPageWrapper {
  error?: ErrorProps | null;
  loading?: boolean;
}

interface WrapperState {
  error?: Error | PageError | null;
}

export default function pageWrapper<PropsType extends WithPageWrapper>(
  WrappedComponent: React.ComponentType<PropsType>,
) {
  return class PageWrapper extends React.Component<PropsType, WrapperState> {
    state: WrapperState = {};

    static getDerivedStateFromError(error: Error | PageError) {
      return {
        error: (error instanceof PageError && error) || {
          title: error.message || 'Something went wrong',
          statusCode: 500,
        },
      };
    }

    componentDidCatch(error: Error | PageError, errorInfo: ErrorInfo) {
      // Можно также сохранить информацию об ошибке в соответствующую службу журнала ошибок
      console.error('Wrapper did catch', error.message);
    }

    render() {
      const error = this.props.error;
      const loading = this.props.loading;
      if (error) {
        return <ErrorPage statusCode={error.statusCode} title={error.title} />;
      }
      if (loading) {
        return (
          <ContainerWrapper>
            <LoaderProgress />
          </ContainerWrapper>
        );
      }
      return <WrappedComponent {...this.props} />;
    }
  };
}
