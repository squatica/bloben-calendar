import { getHostname } from '../../utils/common';
import { setUser } from '../../redux/actions';
import ProfileApi from '../../api/ProfileApi';

export const checkLogin = async (
  setContext: any,
  handleDemoRedirect: any,
  reduxDispatch: any
): Promise<void> => {
  if (!window.env?.apiUrl) {
    setContext('isLogged', false);
    setContext('isAppStarting', false);

    const apiUrl = `${getHostname()}/api`;

    window.localStorage.setItem('apiUrl', apiUrl);
    window.env.apiUrl = apiUrl;

    handleDemoRedirect();

    return;
  }

  try {
    const response = await ProfileApi.getProfile();

    if (response.data.id) {
      setContext('isLogged', true);
      setContext('isAppStarting', false);
      reduxDispatch(setUser(response.data));
    } else {
      setContext('isAppStarting', false);
    }
  } catch (e: any) {
    if (e?.response.status === 401) {
      setContext('isLogged', false);
      setContext('isAppStarting', false);
      return;
    }

    setContext('isLogged', true);
    setContext('isAppStarting', false);
  }
};
