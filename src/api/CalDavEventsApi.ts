import { AxiosResponse } from 'axios';
import { CommonResponse } from '../bloben-interface/interface';
import {
  CreateCalDavEventRequest,
  DeleteCalDavEventRequest,
  DeleteRepeatedCalDavEventRequest,
  UpdateCalDavEventRequest,
  UpdatePartstatStatusRequest,
  UpdateRepeatedCalDavEventRequest,
} from '../bloben-interface/event/event';
import { GetCaldavEventResponse } from '../bloben-interface/caldavEvent/caldavEvent';
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
  getEvent: async (
    calendarID: string,
    url: string
  ): Promise<AxiosResponse<GetCaldavEventResponse>> => {
    return Axios.get(`/v1/caldav-events?calendarID=${calendarID}&url=${url}`);
  },
  updateRepeatedEvent: async (
    data: UpdateRepeatedCalDavEventRequest
  ): Promise<AxiosResponse<CommonResponse>> => {
    return Axios.put(`/v1/caldav-events/repeated`, data);
  },
  deleteRepeatedEvent: async (
    data: DeleteRepeatedCalDavEventRequest
  ): Promise<AxiosResponse<CommonResponse>> => {
    return Axios.delete(`/v1/caldav-events/repeated`, data);
  },
  updateStatus: async (
    id: string,
    data: UpdatePartstatStatusRequest
  ): Promise<AxiosResponse<CommonResponse>> => {
    return Axios.patch(`/v1/caldav-events/${id}`, data);
  },
};
