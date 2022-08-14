import { AxiosResponse } from 'axios';

import { GetCardDavAddressBooks } from '../bloben-interface/cardDavAddressBook/cardDavAddressBook';
import Axios from '../lib/Axios';

export default {
  getAll: async (): Promise<AxiosResponse<GetCardDavAddressBooks[]>> => {
    return Axios.get(`/v1/carddav/address-books`);
  },
};
