import { AxiosResponse } from 'axios';
import { CommonResponse } from '../bloben-interface/interface';
import {
  CreateWebcalCalendarRequest,
  GetWebcalCalendarsResponse,
  PatchWebcalCalendarRequest,
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
  patchCalendar: async (
    id: string,
    data: PatchWebcalCalendarRequest
  ): Promise<AxiosResponse<CommonResponse>> => {
    return Axios.patch(`/v1/webcal/calendars/${id}`, data);
  },
  deleteWebcalCalendar: async (
    id: string
  ): Promise<AxiosResponse<CommonResponse>> => {
    return Axios.delete(`/v1/webcal/calendars/${id}`);
  },
};
