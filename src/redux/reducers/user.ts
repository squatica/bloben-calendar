import { User } from '../../types/interface';

const user = (state: User = { username: '', id: '' }, action: any) => {
  switch (action.type) {
    case 'SET_USER':
      return action.payload;
    default:
      return state;
  }
};

export default user;
