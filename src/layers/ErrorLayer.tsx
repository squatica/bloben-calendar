/* eslint-disable */
import { ErrorBoundary } from 'react-error-boundary';
import ChakraModal from '../components/chakraCustom/ChakraModal';
import React from 'react';
import PrimaryButton from '../components/chakraCustom/primaryButton/PrimaryButton';

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
    // <ChakraModal handleClose={resetErrorBoundary} isOpen={true}>
    <>
      <p>Something went wrong:</p>
      <br />
      <pre>{error.message}</pre>
      <br />
      <button onClick={resetErrorBoundary}>Try again</button>
    </>
    // </ChakraModal>
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
