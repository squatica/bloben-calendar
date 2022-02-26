import React from 'react';

import './ScrollView.scss';
import { parseCssDark } from '../../utils/common';

interface ScrollViewProps {
  isDark: boolean;
  children: any;
}
const ScrollView = (props: ScrollViewProps) => {
  const { isDark, children } = props;

  return (
    <div className={parseCssDark('ScrollView__wrapper', isDark)}>
      <div className={'ScrollView__container'}>{children}</div>
    </div>
  );
};

export default ScrollView;
