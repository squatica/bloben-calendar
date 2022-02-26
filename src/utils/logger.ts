/* eslint-disable @typescript-eslint/no-unused-vars */
export enum LOG_TYPE {
  INFO = 'INFO',
  DEBUG = 'DEBUG',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
}

export interface LogEntry {
  date: string;
  type: LOG_TYPE;
  source: string;
  msg: string;
  data: any | null;
}

export const createLog = (type: LOG_TYPE, msg: string, data?: any) => {
  return;
};
