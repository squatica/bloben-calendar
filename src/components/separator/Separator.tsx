import './Separator.scss';
import React from 'react';

interface SeparatorProps {
  height?: number;
  width?: number;
}
const Separator = (props: SeparatorProps) => {
  const { height, width } = props;

  const style: {
    height: number;
    width: number;
  } = {
    height: height ? height : 0,
    width: width ? width : 0,
  };

  return <div className={'Separator'} style={style} />;
};

export default Separator;
