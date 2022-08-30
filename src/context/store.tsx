import { GetServerSettingsUser } from '../bloben-interface/serverSettings/serverSettings';
import { GetVersion } from '../bloben-interface/version/version';
import { LOCATION_PROVIDER } from '../bloben-interface/enums';
import React, { createContext, useEffect, useReducer } from 'react';
import Reducer from './reducer';

export interface StoreContext {
  isLogged: boolean;
  isDark: boolean;
  isLoading: boolean;
  isAppStarting: boolean;
  isMobile: boolean;
  snackbarIsVisible: boolean;
  snackbar: any;
  errorObj: Error | null;
  settingsOpen: boolean;
  syncSequence: number;
  isSyncing: boolean;
  version: GetVersion;
  emailConfig: {
    hasSystemConfig: boolean;
    hasCustomConfig: boolean;
    mailto: string | null;
    imap: any;
    smtp: any;
  };
  isSyncingServer: boolean;
  serverSettings: GetServerSettingsUser;
}

const initialContext: StoreContext = {
  isLogged: false,
  isDark: false,
  isLoading: false,
  isAppStarting: true,
  isMobile: false,
  snackbarIsVisible: false,
  snackbar: {},
  errorObj: null,
  settingsOpen: false,
  syncSequence: 0,
  isSyncing: false,
  version: {
    lastVersion: '',
    apiVersion: '',
    dockerImageVersion: '',
  },
  emailConfig: {
    hasCustomConfig: false,
    hasSystemConfig: false,
    mailto: null,
    imap: null,
    smtp: null,
  },
  isSyncingServer: false,
  serverSettings: {
    locationProvider: LOCATION_PROVIDER.OPEN_STREET_MAPS,
  },
};

const StoreProvider = ({ children }: any) => {
  const [store, dispatch] = useReducer(Reducer, initialContext);

  // load env
  const loadEnv = async () => {
    const apiUrl = window.localStorage.getItem('apiUrl');

    if (apiUrl) {
      window.env.apiUrl = apiUrl;
    }
  };

  useEffect(() => {
    loadEnv();
  }, []);

  return (
    <Context.Provider value={[store, dispatch]}>{children}</Context.Provider>
  );
};

// @ts-ignore
export const Context: any = createContext();
export default StoreProvider;
