import { EvaIcons } from 'components/eva-icons';
import React from 'react';

import './Spinner.scss';
import { parseCssDark } from '../../../utils/common';

const Spinner = (props: { isDark?: boolean }) => {
  return (
    <>
      <EvaIcons.Loader
        className={`${parseCssDark('Spinner-icon', props.isDark)} rotate`}
      />
    </>
  );
};

export default Spinner;
