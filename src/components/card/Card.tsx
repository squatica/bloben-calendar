import './Card.scss';

import CardTitle from './cardTitle/CardTitle';
import React from 'react';

interface CardProps {
  children: any;
  isDark: boolean;
  title?: string;
  className?: string;
  titleClassName?: string;
  style?: any;
}

const Card = (props: CardProps) => {
  const { title, children, titleClassName, isDark, style } = props;

  return (
    <div className={'CardContainer'} style={style}>
      {title ? (
        <CardTitle isDark={isDark} title={title} className={titleClassName} />
      ) : null}
      {children}
    </div>
  );
};

export default Card;
