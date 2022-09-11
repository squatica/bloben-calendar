import { AxiosError, AxiosResponse } from 'axios';
import { LoginRequest, LoginResponse } from 'bloben-interface';
import UserApi from '../../../src/api/AuthApi';

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
};
