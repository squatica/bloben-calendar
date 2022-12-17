import { AxiosResponse } from 'axios';
import {
  CommonResponse,
  GetUserEmailConfigResponse,
  PatchUserEmailConfigRequest,
  UpdateUserEmailConfigRequest,
} from 'bloben-interface';
import Axios from '../lib/Axios';

export default {
  create: async (
    data: UpdateUserEmailConfigRequest
  ): Promise<AxiosResponse<CommonResponse>> => {
    return Axios.post('/app/v1/users/email-config', data);
  },
  update: async (
    data: UpdateUserEmailConfigRequest,
    id: string
  ): Promise<AxiosResponse<CommonResponse>> => {
    return Axios.put(`/app/v1/users/email-config/${id}`, data);
  },
  patch: async (
    data: PatchUserEmailConfigRequest,
    id: string
  ): Promise<AxiosResponse<CommonResponse>> => {
    return Axios.patch(`/app/v1/users/email-config/${id}`, data);
  },
  get: async (): Promise<AxiosResponse<GetUserEmailConfigResponse>> => {
    return Axios.get('/app/v1/users/email-config');
  },
  delete: async (id: string): Promise<AxiosResponse<CommonResponse>> => {
    return Axios.delete(`/app/v1/users/email-config/${id}`);
  },
};
