import { CommonResponse } from '../bloben-interface/interface';
import {
  GetAccountResponse,
  GetSessionResponse,
  LoginRequest,
  LoginResponse,
} from '../bloben-interface/user/user';
import Axios, { config } from '../lib/Axios';
import axios, { AxiosResponse } from 'axios';

export default {
  login: async (
    url: string,
    data: LoginRequest
  ): Promise<AxiosResponse<LoginResponse>> => {
    return axios.post(`${url}/v1/users/login`, data, config);
  },
  getSession: async (): Promise<AxiosResponse<GetSessionResponse>> => {
    return Axios.get('/v1/users/login');
  },
  getAccount: async (): Promise<AxiosResponse<GetAccountResponse>> => {
    return Axios.get('/v1/users/account');
  },
  logout: async (): Promise<AxiosResponse<CommonResponse>> => {
    return Axios.get('/v1/users/logout');
  },
};
