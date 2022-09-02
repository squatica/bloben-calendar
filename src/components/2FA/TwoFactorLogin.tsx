import {
  Button,
  Center,
  Container,
  FormControl,
  FormLabel,
  Input,
  useToast,
} from '@chakra-ui/react';
import { Context, StoreContext } from '../../context/store';
import { Heading } from '@chakra-ui/react';
import { Separator } from 'bloben-components';
import { setUser } from '../../redux/actions';
import { useDispatch } from 'react-redux';
import ProfileApi from '../../api/ProfileApi';
import React, { useContext, useState } from 'react';
import TwoFactorAuthApi from '../../api/TwoFactorAuth.api';

interface TwoFactorLoginProps {
  username: string;
  password: string;
}

const TwoFactorLogin = (props: TwoFactorLoginProps) => {
  const toast = useToast();
  const [, dispatch]: [StoreContext, any] = useContext(Context);

  const setContext = (type: string, payload: any) => {
    dispatch({ type, payload });
  };

  const reduxDispatch = useDispatch();

  const { username, password } = props;

  const [otpCode, setOtpCode] = useState('');

  const onChange = (e: any) => {
    setOtpCode(e.target.value);
  };

  const handleClick = async () => {
    try {
      const response = await TwoFactorAuthApi.loginWith2FA({
        username,
        password,
        otpCode,
      });

      if (response.data.isLogged && response.data.isTwoFactorEnabled) {
        const userResponse = await ProfileApi.getProfile();

        setContext('isLogged', true);

        if (userResponse?.data?.id) {
          setContext('isLogged', true);
          setContext('isAppStarting', false);
          reduxDispatch(setUser(userResponse?.data));
        }
      }
    } catch (e: any) {
      if (e.response?.data?.message) {
        toast({
          title: e.response?.data?.message,
          status: 'error',
        });
      }

      setContext('isAppStarting', false);
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
      <Container width={400}>
        <Heading as="h2" size="2xl">
          Two factor login
        </Heading>
        <Separator />
        <FormControl id="otpCode" size="2xl">
          <FormLabel size="2xl">OTP code</FormLabel>
          <Input
            size="lg"
            name={'otpCode'}
            value={otpCode}
            onChange={onChange}
          />
        </FormControl>
        <Separator height={40} />
        <Center>
          <Button onClick={handleClick} colorScheme="teal" size="md">
            Confirm
          </Button>
        </Center>
      </Container>
    </div>
  );
};

export default TwoFactorLogin;
