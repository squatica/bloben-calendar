import { AxiosResponse } from 'axios';

import { CommonResponse } from '../bloben-interface/interface';
import {
  CreateCardDavContactRequest,
  GetCardDavContactsResponse,
  SearchCardDavContactResponse,
} from '../bloben-interface/cardDavContact/cardDavContact';
import Axios from '../lib/Axios';

export default {
  search: async (
    text: string
  ): Promise<AxiosResponse<SearchCardDavContactResponse>> => {
    return Axios.get(`/v1/carddav/contacts/search?text=${text}`);
  },
  getAll: async (
    addressBookID: string
  ): Promise<AxiosResponse<GetCardDavContactsResponse[]>> => {
    return Axios.get(`/v1/carddav/contacts?addressBookID=${addressBookID}`);
  },
  delete: async (id: string): Promise<AxiosResponse<CommonResponse>> => {
    return Axios.delete(`/v1/carddav/contacts/${id}`);
  },
  create: async (
    data: CreateCardDavContactRequest
  ): Promise<AxiosResponse<CommonResponse>> => {
    return Axios.post(`/v1/carddav/contacts`, data);
  },
};
