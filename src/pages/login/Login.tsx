import { Container, useToast } from '@chakra-ui/react';
import { Context, StoreContext } from '../../context/store';
import { LoginComponent } from 'bloben-components';
import { TOAST_STATUS } from '../../types/enums';
import { createToast } from '../../utils/common';
import { handleLogin } from './loginHelper';
import React, { useContext, useState } from 'react';
import TwoFactorAuthApi from '../../api/TwoFactorAuth.api';

const Login = () => {
  const toast = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [twoFactorVisible, setTwoFactorVisible] = useState(false);

  const [store, dispatch]: [StoreContext, any] = useContext(Context);

  const { isMobile } = store;

  const setContext = (type: string, payload: any) => {
    dispatch({ type, payload });
  };

  const login = (username: string, password: string) =>
    handleLogin(
      username,
      password,
      setIsLoading,
      setContext,
      toast,
      setTwoFactorVisible
    );

  const submitTwoFactorCode = async (
    username: string,
    password: string,
    otpCode: string
  ) => {
    try {
      const response = await TwoFactorAuthApi.loginWith2FA({
        username,
        password,
        otpCode,
      });

      setIsLoading(false);

      if (response.data.isLogged) {
        setContext('isLogged', true);
      }
    } catch (e: any) {
      setContext('isLogged', false);
      toast(createToast(e.response?.data?.message, TOAST_STATUS.ERROR));
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        width: '100%',
      }}
    >
      <Container
        width={isMobile ? '100%' : 300}
        paddingInlineStart={'1.3rem'}
        paddingInlineEnd={'1.3rem'}
      >
        <LoginComponent
          twoFactorVisible={twoFactorVisible}
          isLoading={isLoading}
          onSubmitLogin={login}
          onSubmitTwoFactorLogin={submitTwoFactorCode}
        />
      </Container>
    </div>
  );
};

export default Login;
