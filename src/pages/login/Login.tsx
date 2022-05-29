import { AxiosResponse } from 'axios';
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
import { Context } from '../../context/store';
import { TOAST_STATUS } from '../../types/enums';
import { createToast, getHostname } from '../../utils/common';
import ChakraInput from '../../components/chakraCustom/ChakraInput';
import PrimaryButton from '../../components/chakraCustom/primaryButton/PrimaryButton';
import React, { useContext, useState } from 'react';
import Separator from 'components/separator/Separator';
import UserApi from '../../api/UserApi';
import VersionFooter from '../../components/versionFooter/VersionFooter';

const Login = () => {
  const toast = useToast();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [store, dispatch] = useContext(Context);

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
  };

  const handleLogin = async (): Promise<void> => {
    setIsLoading(true);

    const apiUrl = `${getHostname()}/api`;

    window.localStorage.setItem('apiUrl', apiUrl);
    window.env.apiUrl = apiUrl;

    try {
      const response: AxiosResponse = await UserApi.login(apiUrl, {
        username,
        password,
      });

      setIsLoading(false);

      if (response.data.isLogged && !response.data.isTwoFactorEnabled) {
        setContext('isLogged', true);
      }
    } catch (e) {
      // @ts-ignore
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
        <Heading as="h2" size="2xl">
          Login
        </Heading>
        <Separator height={30} />
        <FormControl id="username" size="2xl">
          <FormLabel size="2xl">Username</FormLabel>
          <ChakraInput
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
                  handleLogin();
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
          <PrimaryButton isLoading={isLoading} onClick={handleLogin}>
            Login
          </PrimaryButton>
          <Separator height={80} />
          <VersionFooter />
        </Center>
      </Container>
    </div>
  );
};

export default Login;
