import { reduxStore } from '../../layers/ReduxProvider';
import { setUser } from '../actions';
import ProfileApi from '../../api/ProfileApi';

export const refreshUserData = async () => {
  const responseAccount = await ProfileApi.getProfile();

  reduxStore.dispatch(setUser(responseAccount.data));
};
