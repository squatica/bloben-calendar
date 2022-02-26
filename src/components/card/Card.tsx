import './Card.scss';

import CardTitle from './cardTitle/CardTitle';
import React from 'react';

interface CardProps {
  children: any;
  isDark: boolean;
  title?: string;
  className?: string;
  titleClassName?: string;
}

const Card = (props: CardProps) => {
  const { title, children, titleClassName, isDark } = props;

  return (
    <div className={'CardContainer'}>
      {title ? (
        <CardTitle isDark={isDark} title={title} className={titleClassName} />
      ) : null}
      {children}
    </div>
  );
};

export default Card;
