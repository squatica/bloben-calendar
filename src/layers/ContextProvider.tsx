import React, { useContext, useEffect } from 'react';

import { Context } from '../context/store';
import {
  DARK_THEME,
  LIGHT_THEME,
  SYSTEM_THEME,
  changeTheme,
} from 'utils/changeTheme';
import { DESKTOP_MIN_WIDTH } from '../types/constants';
import { parseCssDark } from 'utils/common';
import { useWidth } from 'utils/layout';
import LoadingScreen from '../components/loadingScreen/LoadingScreen';

interface ContextProviderProps {
  children: any;
}

/**
 * Setup init context options
 * @constructor
 */
const ContextProvider = (props: ContextProviderProps) => {
  const [store, dispatch] = useContext(Context);

  const { isDark } = store;

  const width = useWidth();

  const setContext = (type: string, payload: any) => {
    dispatch({ type, payload });
  };

  /**
   * Set mobile/desktop layout
   */
  useEffect(() => {
    if (width < DESKTOP_MIN_WIDTH) {
      setContext('isMobile', true);
    } else {
      setContext('isMobile', false);
    }
  }, [width]);

  /*
   * Add listener for preferred color theme
   */
  useEffect(() => {
    window.matchMedia('(prefers-color-scheme: dark)').addListener(async (e) => {
      // First check if system settings for theme are set
      // Try to load theme from database
      const themeLocalValue: any | null = null; //await
      // LocalForage.getItem('theme');

      if (themeLocalValue && themeLocalValue === SYSTEM_THEME) {
        if (e.matches) {
          // Dark
          await changeTheme(DARK_THEME, setContext);
        } else {
          // Light
          await changeTheme(LIGHT_THEME, setContext);
        }
      }
    });
  }, []);

  return (
    <div className={parseCssDark('root-wrapper', isDark)}>
      {props.children}
      {store.isAppStarting ? <LoadingScreen isDark={false} /> : null}
    </div>
  );
};

export default ContextProvider;
