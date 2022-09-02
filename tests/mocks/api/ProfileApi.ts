import { AxiosError, AxiosResponse } from 'axios';
import { GetProfileResponse } from 'bloben-interface';

import { ROLE } from '../../../src/enums';
import ProfileApi from '../../../src/api/ProfileApi';

export const mockProfileApi = () => {
  ProfileApi.getProfile = async () => {
    return {
      status: 200,
      data: {
        username: 'tester',
        id: '12345',
        role: ROLE.USER,
      },
    } as AxiosResponse<GetProfileResponse>;
  };
};

export const mockProfileApiFail = () => {
  ProfileApi.getProfile = async () => {
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
