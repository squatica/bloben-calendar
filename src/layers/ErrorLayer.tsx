/* eslint-disable */
import { ErrorBoundary } from 'react-error-boundary';
import React from 'react';

const formatStackTrace = (stackTrace: string) => {
  if (stackTrace.length <= 300) {
    return stackTrace;
  }

  return stackTrace.slice(0, 300);
};

// @ts-ignore
const ErrorFallback = (props: any) => {
  const { error, resetErrorBoundary } = props;

  return (
    <>
      <p>Something went wrong:</p>
      <br />
      <pre>{error.message}</pre>
      <br />
      <button onClick={resetErrorBoundary}>Try again</button>
    </>
  );
};

const ErrorLayer = (props: any) => {
  const errorHandler = async (
    error: Error,
    info: { componentStack: string }
  ) => {};

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback} onError={errorHandler}>
      {props.children}
    </ErrorBoundary>
  );
};

export default ErrorLayer;
