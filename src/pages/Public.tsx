/* eslint-disable */
import PublicApi from '../api/PublicApi';
import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Context } from '../context/store';
import PublicCalendar from '../components/publicCalendar/PublicCalendar';
import { CalDavEvent } from '../types/interface';
import { getHostname } from '../utils/common';
import { useNavigate } from 'react-router-dom';
import NotFoundPage from './NotFound';
import { GetSharedLinkPublicResponse } from '../bloben-interface/public/SharedLinkPublic';

const Public = () => {
  const navigate = useNavigate();
  const [store, dispatch] = useContext(Context);

  const [events, setEvents] = useState<CalDavEvent[]>([]);
  const [settings, setSettings] = useState<GetSharedLinkPublicResponse | null>(
    null
  );

  const setContext = (type: string, payload: any) => {
    dispatch({ type, payload });
  };

  const params = useParams();

  const init = () => {
    const apiUrl = `${getHostname()}/api`;

    window.localStorage.setItem('apiUrl', apiUrl);
    window.env.apiUrl = apiUrl;
  };

  const getCalendars = async () => {
    try {
      if (params.id) {
        const responseSharedLink = await PublicApi.getPublicSharedLink(
          params.id
        );

        if (responseSharedLink.data) {
          setSettings(responseSharedLink.data.settings);
        }

        const response = await PublicApi.getPublicCalendars(params.id);
      }

      setContext('isAppStarting', false);
    } catch (e: any) {
      setContext('isAppStarting', false);

      if (e.response?.status === 404 || e.response?.status === 403) {
        navigate('/calendar/404');
      }
    }
  };

  useEffect(() => {
    init();
    getCalendars();
  }, []);

  return (
    <div>
      {params.id && settings ? (
        <PublicCalendar
          sharedID={params.id}
          events={events}
          setEvents={setEvents}
          settings={settings}
        />
      ) : (
        <NotFoundPage />
      )}
    </div>
  );
};

export default Public;
