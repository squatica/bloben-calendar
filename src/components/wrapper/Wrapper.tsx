import './Wrapper.scss';
import { parseCssDark } from '../../utils/common';
import React from 'react';

interface WrapperProps {
  children: any;
}
const Wrapper = (props: WrapperProps) => {
  const { children } = props;

  return (
    <div className={parseCssDark('account__wrapper', false)}>{children}</div>
  );
};

export default Wrapper;
