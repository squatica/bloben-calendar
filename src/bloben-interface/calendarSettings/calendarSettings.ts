import { ALARM_TYPE } from '../enums';

export interface GetCalendarSettingsResponse {
  defaultCalendar: string;
  defaultAlarmType: ALARM_TYPE;
  defaultTimezone: string;
  autoUpdateTimezone: boolean;
}

export interface UpdateCalendarSettingsRequest {
  defaultAlarmType?: ALARM_TYPE;
  defaultTimezone?: string;
  autoUpdateTimezone?: boolean;
}
