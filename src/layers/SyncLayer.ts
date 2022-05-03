import { Context } from '../context/store';
import { getLocalTimezone } from '../utils/common';
import {
  setCaldavAccounts,
  setCaldavCalendars,
  setCaldavEvents,
  setCalendarSettings,
  setWebcalCalendars,
} from '../redux/actions';
import { useContext, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import CalDavAccountApi from '../api/CalDavAccountApi';
import CalDavCalendarApi from '../api/CalDavCalendarApi';
import CalendarSettingsApi from '../api/CalendarSettingsApi';
import EventsApi from '../api/EventsApi';
import GeneralApi from '../api/GeneralApi';
import UserEmailConfigApi from '../api/UserEmailConfigApi';
import WebcalCalendarApi from '../api/WebcalCalendarApi';

const SyncLayer = (props: any) => {
  const [, dispatchContext] = useContext(Context);
  const setContext = (type: string, payload: any) => {
    dispatchContext({ type, payload });
  };

  const dispatch = useDispatch();

  const loadData = async () => {
    const calendarSettingsResponse = await CalendarSettingsApi.get();
    const calDavAccountsResponse = await CalDavAccountApi.getCalDavAccounts();
    const calDavCalendarsResponse =
      await CalDavCalendarApi.getCalDavCalendars();
    const calDavEventsResponse = await EventsApi.getCachedEvents();
    const webcalCalendarsResponse =
      await WebcalCalendarApi.getWebcalCalendars();

    try {
      if (!calendarSettingsResponse.data.timezone) {
        await CalendarSettingsApi.patch({
          timezone: getLocalTimezone(),
        });
      }
      // eslint-disable-next-line no-empty
    } catch (e) {}

    dispatch(setCalendarSettings(calendarSettingsResponse.data));
    dispatch(setCaldavAccounts(calDavAccountsResponse.data));
    dispatch(setCaldavCalendars(calDavCalendarsResponse.data));
    dispatch(setCaldavEvents(calDavEventsResponse.data));
    dispatch(setWebcalCalendars(webcalCalendarsResponse.data));

    try {
      await GeneralApi.getSync();
      // eslint-disable-next-line no-empty
    } catch (e) {}
    try {
      const emailConfigResponse = await UserEmailConfigApi.get();

      setContext('emailConfig', emailConfigResponse.data);
      // eslint-disable-next-line no-empty
    } catch (e) {}
  };

  useEffect(() => {
    loadData();

    try {
      Notification.requestPermission();
      // eslint-disable-next-line no-empty
    } catch (e) {}
  }, []);

  return props.children;
};
export default SyncLayer;
