import { Context, StoreContext } from '../context/store';
import { DateTime } from 'luxon';
import { ReduxState } from '../types/interface';
import { THEME_SETTINGS, ThemeSettings } from '../redux/reducers/themeSettings';
import { handleIsDarkTheme } from '../utils/common';
import { useColorMode } from '@chakra-ui/react';
import { useContext, useEffect } from 'react';
import { useSelector } from 'react-redux';

const checkIfIsDarkThemeTime = (themeSettings: ThemeSettings) => {
  const now = DateTime.now().toMillis();
  const dateFrom = DateTime.now()
    .set({
      hour: themeSettings.value.from.hour,
      minute: themeSettings.value.from.minute,
    })
    .toMillis();

  const dateTo = DateTime.now()
    .set({
      hour: themeSettings.value.to.hour,
      minute: themeSettings.value.to.minute,
    })
    .toMillis();

  return now >= dateTo || now <= dateFrom;
};

const AuthProvider = (props: any) => {
  const [, dispatch]: [StoreContext, any] = useContext(Context);
  const themeSettings: ThemeSettings = useSelector(
    (state: ReduxState) => state.themeSettings
  );

  const setContext = (type: string, payload: any) => {
    dispatch({ type, payload });
  };

  const colorMode = useColorMode();

  useEffect(() => {
    const newValue =
      themeSettings.settings === THEME_SETTINGS.TIME
        ? checkIfIsDarkThemeTime(themeSettings)
        : handleIsDarkTheme(themeSettings);
    setContext('isDark', newValue);
    colorMode?.setColorMode(newValue ? 'dark' : 'light');
    window.localStorage.isDark = newValue;
  }, []);

  useEffect(() => {
    const newValue =
      themeSettings.settings === THEME_SETTINGS.TIME
        ? checkIfIsDarkThemeTime(themeSettings)
        : handleIsDarkTheme(themeSettings);
    setContext('isDark', newValue);
    colorMode?.setColorMode(newValue ? 'dark' : 'light');
    window.localStorage.isDark = newValue;
  }, [JSON.stringify(themeSettings)]);

  return props.children;
};

export default AuthProvider;
