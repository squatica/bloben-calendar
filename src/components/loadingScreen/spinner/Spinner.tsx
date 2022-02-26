import { EvaIcons } from 'components/eva-icons';
import React from 'react';

import './Spinner.scss';

const Spinner = () => {
  return (
    <>
      <EvaIcons.Loader className={'Spinner-icon rotate'} />
    </>
  );
};

export default Spinner;
