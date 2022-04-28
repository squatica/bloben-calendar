import { Context } from '../../../context/store';
import { Link, Text } from '@chakra-ui/react';
import React, { useContext } from 'react';
import Separator from '../../../components/separator/Separator';
import SettingsCard from '../settingsCard/SettingsCard';
import VersionFooter from '../../../components/versionFooter/VersionFooter';

const AboutSettings = () => {
  const [store] = useContext(Context);

  return (
    <>
      <SettingsCard title={'About'}>
        <Text fontSize="md">
          Bloben is calendar web application for interacting with your CalDav
          servers.
        </Text>
        <Separator height={8} />
        <Text fontSize="md">
          <Link
            _focus={{ boxShadow: 'none' }}
            target={'_blank'}
            color={store.isDark ? 'pink.300' : 'pink.500'}
            href={'https://bloben.com/docs'}
          >
            Documentation
          </Link>{' '}
        </Text>
        <Separator height={48} />
        <VersionFooter />
      </SettingsCard>
    </>
  );
};

export default AboutSettings;
