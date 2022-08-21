import { AxiosResponse } from 'axios';
import { DateTime } from 'luxon';
import { EVENT_TYPE } from '../bloben-interface/enums';
import {
  GetEventResponse,
  SearchEventsResponse,
} from '../bloben-interface/event/event';
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
  getEventsOnInit: async (
    isDark?: boolean
  ): Promise<AxiosResponse<GetEventResponse[]>> => {
    const dateNow = DateTime.now();
    const rangeFrom = dateNow.minus({ week: 1 }).toUTC().toString();
    const rangeTo = dateNow.plus({ week: 1 }).toUTC().toString();

    return Axios.get(
      `/v1/events/range?rangeFrom=${rangeFrom}&rangeTo=${rangeTo}&isDark=${
        isDark || false
      }`
    );
  },
  searchEvents: async (
    summary: string
  ): Promise<AxiosResponse<SearchEventsResponse[]>> => {
    return Axios.get(`/v1/events/search?summary=${summary}`);
  },
  getEvent: async (
    id: string,
    type: EVENT_TYPE,
    isDark: boolean
  ): Promise<AxiosResponse<GetEventResponse>> => {
    return Axios.get(`/v1/events/${id}?type=${type}&isDark=${isDark}`);
  },
};
