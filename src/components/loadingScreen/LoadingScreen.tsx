import React from 'react';

import './LoadingScreen.scss';

import { parseCssDark } from '../../utils/common';
import Spinner from './spinner/Spinner';

interface LoadingProps {
  isDark: boolean;
}
const LoaderBig = () => {
  const isDark =
    window.localStorage.isDark && window.localStorage.isDark === 'true';

  return (
    <div className={parseCssDark('LoadingScreen__wrapper', isDark)}>
      <Spinner isDark={isDark} />
      <p className={parseCssDark('LoadingScreen__text', isDark)}>Loading</p>
    </div>
  );
};

const LoaderSmall = (props: LoadingProps) => {
  const { isDark } = props;

  return (
    <div className={parseCssDark('LoadingScreen__wrapper', isDark)}>
      <Spinner />
    </div>
  );
};

interface LoadingScreenProps {
  small?: boolean;
  isDark: boolean;
}
const LoadingScreen = (props: LoadingScreenProps) => {
  const { small, isDark } = props;

  return small ? <LoaderSmall isDark={isDark} /> : <LoaderBig />;
};

export default LoadingScreen;
