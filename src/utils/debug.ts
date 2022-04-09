/* eslint-disable no-console */
export const debug = (msg: string, data?: any) => {
  if (process.env.REACT_APP_NODE_ENV === 'development') {
    console.log(`DEBUG MSG: ${msg}`, data);
  }
};
