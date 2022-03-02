import {
  setCaldavAccounts,
  setCaldavCalendars,
  setCaldavEvents,
  setWebcalCalendars,
} from '../redux/actions';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import CalDavAccountApi from '../api/CalDavAccountApi';
import CalDavCalendarApi from '../api/CalDavCalendarApi';
import EventsApi from '../api/EventsApi';
import WebcalCalendarApi from '../api/WebcalCalendarApi';

const SyncLayer = (props: any) => {
  const dispatch = useDispatch();

  const loadData = async () => {
    const calDavAccountsResponse = await CalDavAccountApi.getCalDavAccounts();
    const calDavCalendarsResponse =
      await CalDavCalendarApi.getCalDavCalendars();
    const calDavEventsResponse = await EventsApi.getCachedEvents();
    const webcalCalendarsResponse =
      await WebcalCalendarApi.getWebcalCalendars();

    dispatch(setCaldavAccounts(calDavAccountsResponse.data));
    dispatch(setCaldavCalendars(calDavCalendarsResponse.data));
    dispatch(setCaldavEvents(calDavEventsResponse.data));
    dispatch(setWebcalCalendars(webcalCalendarsResponse.data));
  };

  useEffect(() => {
    loadData();
  }, []);

  return props.children;
};
export default SyncLayer;
