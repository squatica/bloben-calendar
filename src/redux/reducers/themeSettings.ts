export enum THEME_SETTINGS {
  LIGHT = 'LIGHT',
  DARK = 'DARK',
  TIME = 'TIME',
  SYSTEM = 'SYSTEM',
}

export interface ThemeSettings {
  settings: THEME_SETTINGS;
  value: any;
}

export const DEFAULT_TIME_SETTINGS = {
  from: {
    hour: '08',
    minute: '00',
  },
  to: {
    hour: '22',
    minute: '00',
  },
};

export const initThemeSettings: ThemeSettings = {
  settings: THEME_SETTINGS.LIGHT,
  value: DEFAULT_TIME_SETTINGS,
};

const themeSettings = (
  state: ThemeSettings = initThemeSettings,
  action: any
) => {
  switch (action.type) {
    case 'SET_THEME_SETTINGS':
      return action.payload;
    default:
      return state;
  }
};

export default themeSettings;
