import './FormIcon.scss';

import { parseCssDark } from '../../utils/common';
import React, { ReactElement } from 'react';

interface FormIconProps {
  children: ReactElement;
  isDark: boolean;
  hidden?: boolean;
  desktopVisible?: boolean;
  allVisible?: boolean;
  alignTop?: boolean;
  style?: any;
}
const FormIcon = (props: FormIconProps) => {
  const { children, hidden, desktopVisible, allVisible, isDark } = props;

  const IconElement: ReactElement = React.cloneElement(children, {
    className: `${parseCssDark('FormIcon__icon', isDark)} ${
      hidden ? 'FormIcon-hidden' : ''
    }`,
  });

  return (
    <div
      className={`FormIcon__wrapper ${props.alignTop ? 'AlignTop' : ''}`}
      style={props.style}
    >
      <div
        className={`FormIcon__container${
          desktopVisible ? '-desktop-visible' : ''
        }${allVisible ? '-all' : ''}`}
      >
        {IconElement}
      </div>
    </div>
  );
};

export default FormIcon;
