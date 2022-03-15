import { Alarm } from 'ical-js-parser';
import { CALDAV_OBJ_TYPE } from './enums';
import { OnPageChangeData } from 'kalend';
import { WebcalCalendar } from '../redux/reducers/webcalCalendars';

export interface CalDavAccount {
  id: string;
  username: string;
  password: string;
  url: string;
  principalUrl: string;
}

export interface QueryRange {
  rangeFrom: string;
  rangeTo: string;
}

export interface QueryRangeMillis {
  rangeFrom: number;
  rangeTo: number;
}

export interface CalDavCalendar {
  calDavAccountID: string;
  color: string;
  displayName: string;
  id: string;
  timezone: string;
  url: string;
  components: string[];
  // [key: string]: any;
}

export interface CalDavEvent {
  id: string;
  calendarID?: string;
  startAt: string;
  endAt: string;
  timezone: string | null;
  isRepeated: boolean;
  rRule: string | null;
  summary: string | null;
  etag: string;
  location: string | null;
  description: string | null;
  color: string;
  alarms?: Alarm[];
  recurenceID?: string;
  internalID?: string;
  url: string;
  calendarUrl: string;
}

export interface AppSettings {
  logging: boolean;
  timeFormat: string;
  startOfWeek: string;
  defaultView: any;
  hourHeight: number;
  disabledViews: any[];
  timezone: string;
  hiddenCalendarIDs: string[];
}

export interface ReduxState {
  calDavAccounts: CalDavAccount[];
  calDavCalendars: CalDavCalendar[];
  calDavEvents: CalDavEvent[];
  calendarDaysRange: OnPageChangeData;
  baseDateRange: OnPageChangeData;
  settings: AppSettings;
  webcalCalendars: WebcalCalendar[];
  cachedEvents: any[];
  syncLog: SyncLog;
  user: User;
}

export interface Duration {
  weeks?: number;
  days?: number;
  hours?: number;
  minutes?: number;
  seconds?: number;
}

export interface Notification {
  date: string;
  alarm: Alarm;
  eventID: string;
  summary?: string | null;
}

export interface SyncLog {
  events: string;
}

export interface CalDavQueryResult {
  type: CALDAV_OBJ_TYPE;
  data: any[];
}

export interface User {
  id: string;
  username: string;
}
