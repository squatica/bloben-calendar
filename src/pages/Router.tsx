import { APP_PATH } from '../types/enums';
import { Route } from 'react-router-dom';
import Main from './main/Main';
import React from 'react';
import Settings from './settings/Settings';

import SyncLayer from 'layers/SyncLayer';

const AppRouter = () => {
  return (
    <SyncLayer>
      <Route path={APP_PATH.SETTINGS} component={() => <Settings />} />
      <Route path={'/'} component={() => <Main />} />
    </SyncLayer>
  );
};

export default AppRouter;
