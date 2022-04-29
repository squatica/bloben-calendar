import { APP_PATH } from '../types/enums';
import { Route, Routes } from 'react-router-dom';
import Main from './main/Main';
import React from 'react';
import Settings from './settings/Settings';

import SyncLayer from 'layers/SyncLayer';

const AppRouter = () => {
  return (
    <SyncLayer>
      <Routes>
        <Route path={APP_PATH.SETTINGS} element={<Settings />} />
        <Route path={'/'} element={<Main />} />
      </Routes>
    </SyncLayer>
  );
};

export default AppRouter;
