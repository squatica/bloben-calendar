import { Context } from '../../../context/store';
import { Link, Text } from '@chakra-ui/react';
import React, { useContext } from 'react';
import Separator from '../../../components/separator/Separator';
import SettingsCard from '../settingsCard/SettingsCard';

const HelpSettings = () => {
  const [store] = useContext(Context);

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
            color={store.isDark ? 'pink.300' : 'pink.500'}
            href={'https://github.com/nibdo/bloben-app/issues'}
          >
            Github
          </Link>{' '}
          or send email at{' '}
          <Link
            _focus={{ boxShadow: 'none' }}
            color={store.isDark ? 'pink.300' : 'pink.500'}
            href={'mailto:hello@nibdo.com'}
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
