import { AxiosResponse } from 'axios';
import { GetEventResponse } from '../bloben-interface/event/event';
import Axios from '../lib/Axios';

export default {
  getEvents: async (
    rangeFrom: string,
    rangeTo: string,
    isDark?: boolean
  ): Promise<AxiosResponse<GetEventResponse[]>> => {
    return Axios.get(
      `/v1/events/range?rangeFrom=${rangeFrom}&rangeTo=${rangeTo}&isDark=${
        isDark || false
      }`
    );
  },
  getCachedEvents: async (
    isDark?: boolean
  ): Promise<AxiosResponse<GetEventResponse[]>> => {
    return Axios.get(`/v1/events?isDark=${isDark || false}`);
  },
};
