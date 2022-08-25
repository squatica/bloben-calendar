import { TOAST_STATUS } from '../../types/enums';
import { createToast, getHostname } from '../../utils/common';
import UserApi from '../../api/UserApi';

export const handleLogin = async (
  username: string,
  password: string,
  setIsLoading: any,
  setContext: any,
  toast: any
): Promise<void> => {
  setIsLoading(true);

  const apiUrl = `${getHostname()}/api`;

  window.localStorage.setItem('apiUrl', apiUrl);
  window.env.apiUrl = apiUrl;

  try {
    const response = await UserApi.login(apiUrl, {
      username,
      password,
    });

    setIsLoading(false);

    if (response.data.isLogged && !response.data.isTwoFactorEnabled) {
      setContext('isLogged', true);
    }
  } catch (e: any) {
    setContext('isLogged', false);
    toast(createToast(e.response?.data?.message, TOAST_STATUS.ERROR));
    setIsLoading(false);
  }
};
