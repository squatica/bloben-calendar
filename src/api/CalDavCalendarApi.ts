import { AxiosResponse } from 'axios';
import { CommonResponse } from '../bloben-interface/interface';
import { CreateCalDavCalendarRequest } from '../bloben-interface/calDavCalendar/calDavCalendar';
import { GetCalDavCalendar } from '../bloben-interface/calDavCalendar/calDavCalendar';
import Axios from 'lib/Axios';

export default {
  getCalDavCalendars: async (): Promise<AxiosResponse<GetCalDavCalendar[]>> => {
    return Axios.get(`/v1/caldav-calendars`);
  },
  syncCalDavCalendars: async (): Promise<AxiosResponse<void>> => {
    return Axios.post(`/v1/caldav-calendars/sync`);
  },
  createCalendar: async (
    data: CreateCalDavCalendarRequest
  ): Promise<AxiosResponse<CommonResponse>> => {
    return Axios.post(`/v1/caldav-calendars`, data);
  },
  updateCalendar: async (
    id: string,
    data: CreateCalDavCalendarRequest
  ): Promise<AxiosResponse<CommonResponse>> => {
    return Axios.put(`/v1/caldav-calendars/${id}`, data);
  },
  deleteCalendar: async (
    id: string
  ): Promise<AxiosResponse<CommonResponse>> => {
    return Axios.delete(`/v1/caldav-calendars/${id}`);
  },
};
