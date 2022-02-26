import './CardTitle.scss';

import { parseCssDark } from '../../../utils/common';
import React from 'react';

interface CardTitleProps {
  isDark: boolean;
  title: string;
  className?: string;
}

const CardTitle = (props: CardTitleProps) => {
  const { title, isDark, className } = props;

  const cardTitleClassName = `${parseCssDark('CardTitle', isDark)} ${
    className ? className : ''
  }`;

  return <h5 className={cardTitleClassName}>{title}</h5>;
};

export default CardTitle;
