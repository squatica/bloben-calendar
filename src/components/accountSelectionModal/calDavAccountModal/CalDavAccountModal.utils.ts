import { DAV_ACCOUNT_TYPE } from '../../../bloben-interface/enums';

export default {
  state: {
    username: '',
    password: '',
    url: '',
    isLoading: false,
    accountType: DAV_ACCOUNT_TYPE.CALDAV,
  },
};
