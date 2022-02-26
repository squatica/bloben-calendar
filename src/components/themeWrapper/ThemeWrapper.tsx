import React from 'react';

import './ThemeWrapper.scss';

interface ThemeWrapperProps {
  children: any;
}
const ThemeWrapper = (props: ThemeWrapperProps) => {
  return <>{props.children}</>;
};

export default ThemeWrapper;
