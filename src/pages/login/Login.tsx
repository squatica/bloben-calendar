import {
  Button,
  Center,
  Container,
  FormControl,
  FormLabel,
  Heading,
  InputGroup,
  InputRightElement,
  useToast,
} from '@chakra-ui/react';
import { Context, StoreContext } from '../../context/store';
import { TOAST_STATUS } from '../../types/enums';
import { createToast } from '../../utils/common';
import { handleLogin } from './loginHelper';
import ChakraInput from '../../components/chakraCustom/ChakraInput';
import PrimaryButton from '../../components/chakraCustom/primaryButton/PrimaryButton';
import React, { useContext, useState } from 'react';
import Separator from '../../components/separator/Separator';
import TwoFactorAuthApi from '../../api/TwoFactorAuth.api';
import VersionFooter from '../../components/versionFooter/VersionFooter';

const Login = () => {
  const toast = useToast();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [twoFactorVisible, setTwoFactorVisible] = useState(false);

  const [store, dispatch]: [StoreContext, any] = useContext(Context);

  const { isMobile } = store;

  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);

  const setContext = (type: string, payload: any) => {
    dispatch({ type, payload });
  };

  const onChange = (e: any) => {
    if (e.target.name === 'username') {
      setUsername(e.target.value);
    }
    if (e.target.name === 'password') {
      setPassword(e.target.value);
    }
    if (e.target.name === 'otpCode') {
      setOtpCode(e.target.value);
    }
  };

  const login = () =>
    handleLogin(
      username,
      password,
      setIsLoading,
      setContext,
      toast,
      setTwoFactorVisible
    );

  const submitTwoFactorCode = async () => {
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
        {!twoFactorVisible ? (
          <>
            <Heading as="h2" size="2xl">
              Login
            </Heading>
            <Separator height={30} />
            <FormControl id="username" size="2xl">
              <FormLabel size="2xl">Username</FormLabel>
              <ChakraInput
                id={'login-username'}
                size={'lg'}
                name={'username'}
                value={username}
                onChange={onChange}
                autoComplete={'off'}
              />
            </FormControl>
            <Separator height={20} />
            <FormControl id="password" size="2xl">
              <FormLabel size="2xl">Password</FormLabel>
              <InputGroup size={'lg'}>
                <ChakraInput
                  size={'lg'}
                  type={show ? 'text' : 'password'}
                  name={'password'}
                  value={password}
                  onChange={onChange}
                  onKeyPress={(e: any) => {
                    if (e.key === 'Enter' || e.keyCode == 13) {
                      login();
                    }
                  }}
                />
                <InputRightElement width="4.5rem">
                  <Button
                    _focus={{ boxShadow: 'none' }}
                    h="1.75rem"
                    size="sm"
                    onClick={handleClick}
                  >
                    {show ? 'Hide' : 'Show'}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <Separator height={40} />
            <Center flexDirection={'column'}>
              <PrimaryButton isLoading={isLoading} onClick={login}>
                Login
              </PrimaryButton>
              <Separator height={80} />
              <VersionFooter />
            </Center>
          </>
        ) : (
          <>
            <Heading as="h2" size="2xl">
              Two factor
            </Heading>
            <Separator height={30} />
            <FormControl id="otpCode" size="2xl">
              <FormLabel size="2xl">Code</FormLabel>
              <ChakraInput
                id={'login-otpCode'}
                size={'lg'}
                name={'otpCode'}
                value={otpCode}
                onChange={onChange}
                autoComplete={'off'}
                autoFocus={true}
                onKeyPress={(e: any) => {
                  if (e.key === 'Enter' || e.keyCode == 13) {
                    submitTwoFactorCode();
                  }
                }}
              />
            </FormControl>
            <Separator height={40} />
            <Center flexDirection={'column'}>
              <PrimaryButton
                isLoading={isLoading}
                onClick={submitTwoFactorCode}
              >
                Confirm
              </PrimaryButton>
              <Separator height={80} />
              <VersionFooter />
            </Center>
          </>
        )}
      </Container>
    </div>
  );
};

export default Login;
