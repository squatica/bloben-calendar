import { DateTime } from 'luxon';
import {
  deleteCachedEvent,
  insertCachedEvents,
  setEventsSyncLog,
  updateCachedEvent,
} from '../../redux/actions';
import { forEach } from 'lodash';
import { reduxStore } from '../../layers/ReduxProvider';

export const syncOneCachedEvent = (syncItem: any) => {
  // handle delete
  if (syncItem.action === 'DELETE') {
    reduxStore.dispatch(deleteCachedEvent({ id: syncItem.id }));
  }

  // handle insert/update
  if (syncItem.action === 'UPDATE') {
    reduxStore.dispatch(updateCachedEvent(syncItem.event));
  }
};

export const syncEvents = (response: any) => {
  const toUpdate: any = [];

  // TODO remove, moved to WS
  forEach(response.data, (item: any) => {
    // delete all events
    // recreate events to update
    reduxStore.dispatch(deleteCachedEvent({ id: item.id }));

    // handle insert/update
    if (item.action === 'UPDATE') {
      toUpdate.push(item.event);
    }
  });

  reduxStore.dispatch(insertCachedEvents(toUpdate));

  reduxStore.dispatch(setEventsSyncLog(DateTime.now().toUTC().toString()));
};
