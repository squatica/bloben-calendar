import { AxiosResponse } from 'axios';
import { GetCalDavCalendar } from '../bloben-interface/calDavCalendar/calDavCalendar';
import Axios from 'lib/Axios';

export default {
  getCalDavCalendars: async (): Promise<AxiosResponse<GetCalDavCalendar[]>> => {
    return Axios.get(`/v1/caldav-calendars`);
  },
  syncCalDavCalendars: async (): Promise<AxiosResponse<void>> => {
    return Axios.post(`/v1/caldav-calendars/sync`);
  },
};
