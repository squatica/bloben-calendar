import { AxiosResponse } from 'axios';
import { CommonResponse } from '../bloben-interface/interface';
import {
  GetUserEmailConfigResponse,
  UpdateUserEmailConfigRequest,
} from '../bloben-interface/userEmailConfig/userEmailConfig';
import Axios from '../lib/Axios';

export default {
  update: async (
    data: UpdateUserEmailConfigRequest
  ): Promise<AxiosResponse<CommonResponse>> => {
    return Axios.patch('/v1/users/email-config', data);
  },
  get: async (): Promise<AxiosResponse<GetUserEmailConfigResponse>> => {
    return Axios.get('/v1/users/email-config');
  },
  delete: async (): Promise<AxiosResponse<CommonResponse>> => {
    return Axios.delete('/v1/users/email-config');
  },
};
