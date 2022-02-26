import { AxiosResponse } from 'axios';
import { CommonResponse } from '../bloben-interface/interface';
import {
  CreateCalDavEventRequest,
  DeleteCalDavEventRequest,
  UpdateCalDavEventRequest,
} from '../bloben-interface/event/event';
import Axios from '../lib/Axios';

export default {
  createEvent: async (
    data: CreateCalDavEventRequest
  ): Promise<AxiosResponse<CommonResponse>> => {
    return Axios.post(`/v1/caldav-events/`, data);
  },
  updateEvent: async (
    data: UpdateCalDavEventRequest
  ): Promise<AxiosResponse<CommonResponse>> => {
    return Axios.put(`/v1/caldav-events/`, data);
  },
  deleteEvent: async (
    data: DeleteCalDavEventRequest
  ): Promise<AxiosResponse<CommonResponse>> => {
    return Axios.delete(`/v1/caldav-events/`, data);
  },
};
