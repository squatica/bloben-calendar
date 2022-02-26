import { CalDavAccount } from '../../types/interface';

const calDavAccounts = (state: CalDavAccount[] = [], action: any) => {
  switch (action.type) {
    case 'SET_CALDAV_ACCOUNTS':
      return action.payload;
    case 'ADD_TO_CALDAV_ACCOUNTS':
      return [...state, ...[action.payload]];
    case 'DELETE_CALDAV_ACCOUNT':
      return state.filter(
        (item) => item.principalUrl !== action.payload.principalUrl
      );
    default:
      return state;
  }
};

export default calDavAccounts;
