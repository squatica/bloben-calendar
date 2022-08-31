import './CardBase.scss';

import { Context, StoreContext } from '../../context/store';
import { parseCssDark } from '../../utils/common';
import React, { useContext } from 'react';

interface CardBaseProps {
  children: any;
  style?: any;
}

const CardBase = (props: CardBaseProps) => {
  const { children, style } = props;
  const [store]: [StoreContext] = useContext(Context);

  return (
    <div
      className={parseCssDark('CardBase__container', store.isDark)}
      style={style}
    >
      {children}
    </div>
  );
};

export default CardBase;
