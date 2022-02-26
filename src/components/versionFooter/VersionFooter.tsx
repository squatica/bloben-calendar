import React, { useContext } from 'react';

import './VersionFooter.scss';
import { Context } from '../../context/store';
import { parseCssDark } from '../../utils/common';

interface VersionFooterProps {
  isDark: boolean;
}
const VersionFooter = (props: VersionFooterProps) => {
  const { isDark } = props;

  const [store] = useContext(Context);

  const { apiVersion } = store;

  return (
    <div className={'VersionFooter__container'}>
      <p
        className={parseCssDark('VersionFooter__text', isDark)}
      >{`Version ${process.env.REACT_APP_VERSION}`}</p>
      <p
        className={parseCssDark('VersionFooter__text', isDark)}
      >{`Api version ${apiVersion}`}</p>
    </div>
  );
};

export default VersionFooter;
