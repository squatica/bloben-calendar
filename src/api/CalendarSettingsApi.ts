import { AxiosResponse } from 'axios';
import {
  CalendarSettingsResponse,
  PatchCalendarSettingsRequest,
} from '../bloben-interface/calendarSettings/calendarSettings';
import { CommonResponse } from '../bloben-interface/interface';
import Axios from '../lib/Axios';

export default {
  patch: async (
    data: PatchCalendarSettingsRequest
  ): Promise<AxiosResponse<CommonResponse>> => {
    return Axios.patch('/v1/calendar-settings', data);
  },
  get: async (): Promise<AxiosResponse<CalendarSettingsResponse>> => {
    return Axios.get('/v1/calendar-settings');
  },
};
