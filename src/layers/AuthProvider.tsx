import { Context } from '../context/store';
import { Route, Routes } from 'react-router-dom';
import { getHostname, parseCssDark } from '../utils/common';
import { setUser } from '../redux/actions';
import { useDispatch } from 'react-redux';
import GeneralApi from '../api/GeneralApi';
import Login from 'pages/login/Login';
import React, { useContext, useEffect } from 'react';
import UserApi from '../api/UserApi';

const AuthProvider = (props: any) => {
  const reduxDispatch = useDispatch();
  const [store, dispatch] = useContext(Context);
  const { isLogged } = store;

  const setContext = (type: string, payload: any) => {
    dispatch({ type, payload });
  };

  const handleDemoRedirect = () => {
    const query = new URLSearchParams(window.location.search);
    const param = query.get('demo');
    if (param) {
      const apiUrl = `${getHostname()}/api`;

      window.localStorage.setItem('apiUrl', apiUrl);
      window.env.apiUrl = apiUrl;
      window.location.replace('/calendar');
    }
  };

  const checkLogin = async (): Promise<void> => {
    if (!window.env?.apiUrl) {
      setContext('isLogged', false);
      setContext('isAppStarting', false);

      handleDemoRedirect();
      return;
    }

    try {
      const response = await UserApi.getAccount();

      if (response.data.userID) {
        setContext('isLogged', true);
        setContext('isAppStarting', false);
        reduxDispatch(
          setUser({
            id: response.data.userID,
            username: response.data.username,
          })
        );
      } else {
        setContext('isAppStarting', false);
      }
    } catch (e: any) {
      if (e?.response.status === 401) {
        setContext('isLogged', false);
        setContext('isAppStarting', false);
        return;
      }

      setContext('isLogged', true);
      setContext('isAppStarting', false);
    }
  };

  const getApiVersion = async () => {
    if (!window.env?.apiUrl) {
      setContext('isLogged', false);
      return;
    }
    const response = await GeneralApi.getApiVersion();

    setContext('version', response?.data);
  };

  // check login on load
  useEffect(() => {
    checkLogin();
    getApiVersion();
  }, []);

  return (
    <div className={parseCssDark('Surface', store.isDark)}>
      <Routes>
        <Route
          path={'/calendar'}
          element={!isLogged ? <Login /> : props.children}
        />
      </Routes>
    </div>
  );
};

export default AuthProvider;
