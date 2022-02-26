import { initialReduxState } from './reducers';
import { reduxStore } from '../layers/ReduxProvider';
import LocalForage from '../utils/LocalForage';

export const loadState = async () => {
  try {
    const decryptedState: any = await LocalForage.getItem('root');

    if (!decryptedState) {
      return initialReduxState;
    }

    return decryptedState;
  } catch (err) {
    return undefined;
  }
};

export const saveState = async () => {
  try {
    await LocalForage.setItem('root', reduxStore.getState());
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
  }
};
