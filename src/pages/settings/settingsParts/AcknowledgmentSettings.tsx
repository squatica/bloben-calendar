import { Link, Text } from '@chakra-ui/react';
import React from 'react';
import Separator from '../../../components/separator/Separator';
import SettingsCard from '../settingsCard/SettingsCard';

const HelpSettings = () => {
  return (
    <>
      <SettingsCard title={'Acknowledgments'}>
        <div style={{ height: 'auto' }}>
          <Text fontSize="md">
            Logo and App icon -{' '}
            <Link
              _focus={{ boxShadow: 'none' }}
              target={'_blank'}
              color={'primary.400'}
              href={'https://www.behance.net/federicaprunotto'}
            >
              Federica Prunotto
            </Link>{' '}
          </Text>
          <Separator height={8} />
          <Text fontSize="md">
            Icons -{' '}
            <Link
              _focus={{ boxShadow: 'none' }}
              target={'_blank'}
              color={'primary.400'}
              href={'https://akveo.github.io/eva-icons/#/'}
            >
              Eva Icons
            </Link>{' '}
          </Text>
          <Separator height={8} />
          <Text fontSize="md">
            React RRule Generator -{' '}
            <Link
              _focus={{ boxShadow: 'none' }}
              target={'_blank'}
              color={'primary.400'}
              href={'https://github.com/fafruch/react-rrule-generator'}
            >
              fafruch
            </Link>{' '}
          </Text>
          <Separator height={8} />
          <Text fontSize="md">
            <Link
              _focus={{ boxShadow: 'none' }}
              target={'_blank'}
              color={'primary.400'}
              href={
                'https://github.com/nibdo/bloben-calendar/blob/production/package.json'
              }
            >
              Packages
            </Link>{' '}
          </Text>
        </div>
      </SettingsCard>
    </>
  );
};

export default HelpSettings;
