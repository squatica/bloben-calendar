import { DAV_ACCOUNT_TYPE } from '../../../enums';

export interface CalDavAccountModalInitialState {
  username: string;
  password: string;
  url: string;
  isLoading: boolean;
  accountType: DAV_ACCOUNT_TYPE;
}

export const calDavAccountModalState: CalDavAccountModalInitialState = {
  username: '',
  password: '',
  url: '',
  isLoading: false,
  accountType: DAV_ACCOUNT_TYPE.CALDAV,
};
