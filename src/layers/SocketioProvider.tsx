import { AxiosResponse } from 'axios';
import { io } from 'socket.io-client';
import { v4 } from 'uuid';
import React, { useContext, useEffect } from 'react';

import { APP_API_VERSION_1, SOCKET_AUTH_PREFIX } from '../types/constants';
import { Context, StoreContext } from '../context/store';
import { WEBSOCKET_TRANSPORT } from '../types/enums';
import { getApiBaseUrl } from '../utils/common';
import { processSocketMsg } from '../utils/websocket';
import Axios from '../lib/Axios';

export let SocketIO: any = null;

const reconnect = (clientSessionId: string, setContext: any) => {
  // eslint-disable-next-line no-undef
  const wsPath = window.env.apiUrl;

  const socketio = io(getApiBaseUrl(wsPath), {
    path: '/api/ws',
    secure: false,
    auth: { token: clientSessionId },
    transports: [WEBSOCKET_TRANSPORT.WEBSOCKET, WEBSOCKET_TRANSPORT.POLLING],
    reconnection: true,
    rejectUnauthorized: false,
  });

  SocketIO = socketio;

  SocketIO.on('connect', () => {
    return;
  });
  SocketIO.on('sync', (data: any) => {
    processSocketMsg(data, setContext);
  });

  // @ts-ignore
  SocketIO.on('connect_error', (e: any) => {
    // eslint-disable-next-line no-console
    console.log(e);
    // setTimeout(() => {
    //   reconnect(clientSessionId);
    // }, 30000);
  });
};

const SocketioProvider = (props: any) => {
  const [store, dispatch] = useContext(Context);

  const { isLogged } = store as StoreContext;

  const setContext = (type: string, payload: any) => {
    dispatch({ type, payload });
  };
  /**
   * Init websocket connection
   */
  const connectToWs = async (): Promise<void> => {
    if (!navigator.onLine) {
      return;
    }
    if (!isLogged) {
      return;
    }
    try {
      const clientSessionId = `${SOCKET_AUTH_PREFIX}${v4()}`;
      const data: any = {
        clientSessionId,
      };
      // create socketSessionId and save in server memory
      const response: AxiosResponse<any> = await Axios.post(
        `${APP_API_VERSION_1}/socket`,
        data
      );

      if (response?.status === 200) {
        reconnect(clientSessionId, setContext);
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(e);
    }
  };

  useEffect(() => {
    connectToWs();
  }, []);

  return <>{props.children}</>;
};

export default SocketioProvider;
