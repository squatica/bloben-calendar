import { ChakraInput, Separator } from 'bloben-components';
import { Flex, FormControl, FormLabel, Heading } from '@chakra-ui/react';
import React from 'react';

interface EmailConfigAccountPartProps {
  title: string;
  prefix: string;
  onChange: any;
  host: string;
  username: string;
  password: string;
  port: string;
}

const EmailConfigAccountPart = (props: EmailConfigAccountPartProps) => {
  const { onChange, title, prefix, host, username, password, port } = props;

  return (
    <Flex direction={'column'}>
      <Heading size={'md'}>{title}</Heading>
      <Separator height={6} />
      <FormControl>
        <FormLabel htmlFor={`${prefix}Host`}>Host</FormLabel>
        <ChakraInput
          size={'lg'}
          id={`${prefix}Host`}
          name={`${prefix}Host`}
          onChange={onChange}
          value={host}
        />
      </FormControl>
      <Separator height={8} />
      <FormControl>
        <FormLabel htmlFor={`${prefix}Port`}>Port</FormLabel>
        <ChakraInput
          size={'lg'}
          id={`${prefix}Port`}
          name={`${prefix}Port`}
          onChange={onChange}
          value={port}
        />
      </FormControl>
      <Separator height={8} />
      <FormControl>
        <FormLabel htmlFor={`${prefix}Username`}>Username</FormLabel>
        <ChakraInput
          size={'lg'}
          id={`${prefix}Username`}
          name={`${prefix}Username`}
          onChange={onChange}
          value={username}
        />
      </FormControl>
      <Separator height={8} />
      <FormControl>
        <FormLabel htmlFor={`${prefix}Password`}>Password</FormLabel>
        <ChakraInput
          size={'lg'}
          id={`${prefix}Password`}
          name={`${prefix}Password`}
          autoComplete={'off'}
          onChange={onChange}
          value={password}
        />
      </FormControl>
    </Flex>
  );
};

export default EmailConfigAccountPart;
