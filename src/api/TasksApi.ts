import { AxiosResponse } from 'axios';
import {
  CalDavTask,
  CommonResponse,
  CreateCalDavEventRequest,
  DeleteCalDavEventRequest,
  UpdateCalDavEventRequest,
} from 'bloben-interface';
import Axios from '../lib/Axios';

export default {
  getLatestTasks: async (): Promise<AxiosResponse<CalDavTask[]>> => {
    return Axios.get(`/app/v1/caldav-tasks/latest`);
  },
  getTasks: async (
    page: number,
    calendarID: string
  ): Promise<AxiosResponse<any>> => {
    return Axios.get(
      `/app/v1/caldav-tasks?calendarID=${calendarID}&page=${page}&limit=20`
    );
  },
  sync: async (): Promise<AxiosResponse<CommonResponse>> => {
    return Axios.get(`/app/v1/caldav-events/sync`);
  },
  create: async (
    data: CreateCalDavEventRequest
  ): Promise<AxiosResponse<CommonResponse>> => {
    return Axios.post('/app/v1/caldav-events', data);
  },
  update: async (
    data: UpdateCalDavEventRequest
  ): Promise<AxiosResponse<CommonResponse>> => {
    return Axios.put('/app/v1/caldav-events', data);
  },
  delete: async (
    data: DeleteCalDavEventRequest
  ): Promise<AxiosResponse<CommonResponse>> => {
    return Axios.delete(`/app/v1/caldav-events`, data);
  },
};
