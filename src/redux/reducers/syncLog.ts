import { SyncLog } from '../../types/interface';

const INIT_YEAR = 1980;
export const DEFAULT_DATE: string = new Date(INIT_YEAR, 1, 1).toISOString();

const initSyncLog: SyncLog = {
  events: DEFAULT_DATE,
};
const syncLog = (state: SyncLog = initSyncLog, action: any) => {
  switch (action.type) {
    case 'SET_EVENTS_SYNC_LOG':
      return { ...state, events: action.payload };
    default:
      return state;
  }
};

export default syncLog;
