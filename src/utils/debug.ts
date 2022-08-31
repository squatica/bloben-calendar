/* eslint-disable no-console */
import { isDev } from './common';

export const debug = (msg: string, data?: any) => {
  if (isDev()) {
    console.log(`DEBUG MSG: ${msg}`, data);
  }
};
