import { Link, Text } from '@chakra-ui/react';
import React from 'react';
import Separator from '../../../components/separator/Separator';
import SettingsCard from '../settingsCard/SettingsCard';

const HelpSettings = () => {
  return (
    <>
      <SettingsCard title={'Help'}>
        <Text fontSize="md">
          If you have problem with application or found bug, feel free to
          contact us.
        </Text>
        <Separator height={8} />
        <Text fontSize="md">
          You can open new issue at{' '}
          <Link
            _focus={{ boxShadow: 'none' }}
            target={'_blank'}
            color={'primary.400'}
            href={'https://github.com/nibdo/bloben-app/issues'}
          >
            Github
          </Link>{' '}
          or send email at{' '}
          <Link
            _focus={{ boxShadow: 'none' }}
            color={'primary.400'}
            href={'mailto:hello@bloben.com'}
          >
            hello@nibdo.com
          </Link>
          .
        </Text>
        <Separator />
      </SettingsCard>
    </>
  );
};

export default HelpSettings;
