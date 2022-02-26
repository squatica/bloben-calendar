import {
  addToCaldavCalendars,
  deleteCachedEvent,
  deleteCaldavCalendar,
  insertCachedEvents,
  setCaldavEvents,
  updateCaldavCalendar,
} from '../redux/actions';
import { reduxStore } from '../layers/ReduxProvider';
import EventsApi from '../api/EventsApi';

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

const handleSyncGeneral = async () => {
  const calDavEventsResponse = await EventsApi.getCachedEvents();

  reduxStore.dispatch(setCaldavEvents(calDavEventsResponse.data));
};

export const processSocketMsg = async (msg: any) => {
  const msgData: any = JSON.parse(msg);

  if (msgData.type === 'EVENT') {
    handleEvents(msgData);
  }

  if (msgData.type === 'CALENDAR') {
    handleCalendars(msgData);
  }

  if (msgData.type === 'SYNC') {
    await handleSyncGeneral();
  }
};
