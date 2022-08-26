import { AxiosError, AxiosResponse } from 'axios';
import {
  GetAccountResponse,
  LoginRequest,
  LoginResponse,
} from '../../../src/bloben-interface/user/user';
import { ROLE } from '../../../src/bloben-interface/enums';
import UserApi from '../../../src/api/UserApi';

export const mockUserApi = () => {
  UserApi.login = async (url: string, data: LoginRequest) => {
    if (data.password === 'pass123') {
      return {
        status: 200,
        data: {
          isLogged: true,
          isTwoFactorEnabled: false,
        },
      } as AxiosResponse<LoginResponse>;
    }

    throw new AxiosError(
      'Fail',
      '401',
      {},
      {},
      // @ts-ignore
      {
        // @ts-ignore
        data: { message: 'Fail' },
      }
    );
  };
  UserApi.getAccount = async () => {
    return {
      status: 200,
      data: {
        username: 'tester',
        userID: '12345',
        role: ROLE.USER,
      },
    } as AxiosResponse<GetAccountResponse>;
  };
};

export const mockUserApiFail = () => {
  UserApi.getAccount = async () => {
    throw new AxiosError(
      'Fail',
      '401',
      {},
      {},
      // @ts-ignore
      {
        status: 401,
        // @ts-ignore
        data: { message: 'Fail' },
      }
    );
  };
};
