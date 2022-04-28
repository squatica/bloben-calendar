export interface SettingsLocal {
  drawerOpen: boolean;
}
export const initLocalSettings = (): SettingsLocal => {
  return {
    drawerOpen: false,
  };
};

const settingsLocal = (
  state: SettingsLocal = initLocalSettings(),
  action: any
) => {
  switch (action.type) {
    case 'SET_LOCAL_SETTINGS':
      return action.payload;
    case 'UPDATE_SETTINGS':
      return { ...state, ...{ [action.payload.key]: action.payload.value } };
    default:
      return state;
  }
};

export default settingsLocal;
