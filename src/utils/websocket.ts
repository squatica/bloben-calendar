import {
  addToCaldavCalendars,
  deleteCachedEvent,
  deleteCaldavCalendar,
  insertCachedEvents,
  setCaldavCalendars,
  setCaldavEvents,
  setWebcalCalendars,
  updateCaldavCalendar,
} from '../redux/actions';
import { reduxStore } from '../layers/ReduxProvider';
import CalDavCalendarApi from '../api/CalDavCalendarApi';
import EventsApi from '../api/EventsApi';
import WebcalCalendarApi from '../api/WebcalCalendarApi';

const handleEvents = (msg: any) => {
  if (msg.action === 'DELETE') {
    reduxStore.dispatch(deleteCachedEvent({ id: msg.id }));
  }
  if (msg.action === 'UPDATE') {
    reduxStore.dispatch(deleteCachedEvent({ id: msg.id }));

    // handle insert/update
    reduxStore.dispatch(insertCachedEvents(msg.bulkData));
  }
};

const handleCalendars = (msg: any) => {
  if (msg.action === 'DELETE') {
    reduxStore.dispatch(deleteCaldavCalendar({ id: msg.id } as any));
  }
  if (msg.action === 'UPDATE') {
    // handle insert/update
    reduxStore.dispatch(updateCaldavCalendar(msg.data));
  }
  if (msg.action === 'CREATE') {
    // handle insert/update
    reduxStore.dispatch(addToCaldavCalendars([msg.data]));
  }
};

const handleSyncCalDavEvents = async () => {
  const response = await EventsApi.getCachedEvents();

  reduxStore.dispatch(setCaldavEvents(response.data));
};

const handleSyncCalDavCalendars = async () => {
  const response = await CalDavCalendarApi.getCalDavCalendars();

  reduxStore.dispatch(setCaldavCalendars(response.data));
};

const handleSyncWebcalCalendars = async () => {
  const response = await WebcalCalendarApi.getWebcalCalendars();

  reduxStore.dispatch(setWebcalCalendars(response.data));
};

const handleNotifications = (data: { title: string; body: string }) => {
  const notification = new Notification(data.title, {
    body: data.body,
    icon: './icon_144.png',
    badge: './icon_144.png',
  });
  notification.onclick = function (event) {
    event.preventDefault();
    window.open('/calendar');
  };
};

export const processSocketMsg = async (msg: any) => {
  const msgData: any = JSON.parse(msg);

  if (msgData.type === 'EVENT') {
    handleEvents(msgData);
  }

  if (msgData.type === 'CALENDAR') {
    handleCalendars(msgData);
  }

  if (msgData.type === 'CALDAV_EVENTS') {
    await handleSyncCalDavEvents();
  }

  if (msgData.type === 'CALDAV_CALENDARS') {
    await handleSyncCalDavCalendars();
  }

  if (msgData.type === 'WEBCAL_CALENDARS') {
    await handleSyncWebcalCalendars();
  }

  if (msgData.type === 'NOTIFICATIONS') {
    await handleNotifications(msgData);
  }
};
