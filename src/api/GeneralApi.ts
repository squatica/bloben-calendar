import { AxiosResponse } from 'axios';
import { GetServerSettingsUser } from '../bloben-interface/serverSettings/serverSettings';
import { GetVersion } from '../bloben-interface/version/version';
import Axios from '../lib/Axios';

export default {
  getApiVersion: async (): Promise<AxiosResponse<GetVersion>> => {
    return Axios.get('/v1/version');
  },
  getSync: async (): Promise<AxiosResponse<any>> => {
    return Axios.get('/v1/sync');
  },
  getServerSettings: async (): Promise<
    AxiosResponse<GetServerSettingsUser>
  > => {
    return Axios.get('/v1/server-settings/user');
  },
};
