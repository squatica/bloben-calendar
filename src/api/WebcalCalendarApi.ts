import { AxiosResponse } from 'axios';
import { CommonResponse } from '../bloben-interface/interface';
import {
  CreateWebcalCalendarRequest,
  GetWebcalCalendarsResponse,
} from '../bloben-interface/webcalCalendar/webcalCalendar';
import Axios from 'lib/Axios';

export default {
  createWebcalCalendar: async (
    data: CreateWebcalCalendarRequest
  ): Promise<AxiosResponse<CommonResponse>> => {
    return Axios.post(`/v1/webcal/calendars`, data);
  },
  getWebcalCalendars: async (): Promise<
    AxiosResponse<GetWebcalCalendarsResponse[]>
  > => {
    return Axios.get('/v1/webcal/calendars');
  },
  deleteWebcalCalendar: async (
    id: string
  ): Promise<AxiosResponse<CommonResponse>> => {
    return Axios.delete(`/v1/webcal/calendars/${id}`);
  },
};
