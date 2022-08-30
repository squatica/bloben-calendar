import { AxiosResponse } from 'axios';
import { CommonResponse } from '../bloben-interface/interface';
import {
  CreateCalDavAccountRequest,
  GetCalDavAccountResponse,
  UpdateCalDavAccountRequest,
} from '../bloben-interface/calDavAccount/calDavAccount';
import Axios from 'lib/Axios';

export default {
  createCalDavAccount: async (
    data: CreateCalDavAccountRequest
  ): Promise<AxiosResponse<CommonResponse>> => {
    return Axios.post('/app/v1/caldav-accounts', data);
  },
  updateCalDavAccount: async (
    id: string,
    data: UpdateCalDavAccountRequest
  ): Promise<AxiosResponse<CommonResponse>> => {
    return Axios.put(`/app/v1/caldav-accounts/${id}`, data);
  },
  getCalDavAccount: async (
    id: string
  ): Promise<AxiosResponse<GetCalDavAccountResponse>> => {
    return Axios.get(`/app/v1/caldav-accounts/${id}`);
  },
  getCalDavAccounts: async (): Promise<
    AxiosResponse<GetCalDavAccountResponse[]>
  > => {
    return Axios.get(`/app/v1/caldav-accounts/`);
  },
  deleteCalDavAccount: async (
    id: string
  ): Promise<AxiosResponse<GetCalDavAccountResponse>> => {
    return Axios.delete(`/app/v1/caldav-accounts/${id}`);
  },
};
