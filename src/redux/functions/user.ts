import { reduxStore } from '../../layers/ReduxProvider';
import { setUser } from '../actions';
import UserApi from '../../api/AuthApi';

export const refreshUserData = async () => {
  const responseAccount = await UserApi.getAccount();

  reduxStore.dispatch(setUser(responseAccount.data));
};
