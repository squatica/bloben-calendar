import { Context } from '../../../context/store';
import { Link, Text } from '@chakra-ui/react';
import React, { useContext } from 'react';
import Separator from '../../../components/separator/Separator';
import SettingsCard from '../settingsCard/SettingsCard';

const HelpSettings = () => {
  const [store] = useContext(Context);

  return (
    <>
      <SettingsCard title={'Acknowledgments'}>
        <div style={{ height: 'auto' }}>
          <Text fontSize="md">
            Logo and App icon -{' '}
            <Link
              _focus={{ boxShadow: 'none' }}
              target={'_blank'}
              color={store.isDark ? 'pink.300' : 'pink.500'}
              onClick={() =>
                window.open(
                  'https://www.behance.net/federicaprunotto',
                  '_blank'
                )
              }
              href={'https://www.behance.net/federicaprunotto'}
            >
              Federica Prunotto
            </Link>{' '}
          </Text>
          <Separator height={8} />
          <Text fontSize="md">
            License for software -{' '}
            <Link
              _focus={{ boxShadow: 'none' }}
              target={'_blank'}
              color={store.isDark ? 'pink.300' : 'pink.500'}
              onClick={() =>
                window.open('https://jb.gg/OpenSourceSupport', '_blank')
              }
              href={'https://jb.gg/OpenSourceSupport'}
            >
              JetBrains
            </Link>{' '}
          </Text>
          <Separator height={8} />
          <Text fontSize="md">
            Icons -{' '}
            <Link
              _focus={{ boxShadow: 'none' }}
              target={'_blank'}
              color={store.isDark ? 'pink.300' : 'pink.500'}
              onClick={() =>
                window.open('https://akveo.github.io/eva-icons/#/', '_blank')
              }
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
              color={store.isDark ? 'pink.300' : 'pink.500'}
              onClick={() =>
                window.open(
                  'https://github.com/fafruch/react-rrule-generator',
                  '_blank'
                )
              }
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
              color={store.isDark ? 'pink.300' : 'pink.500'}
              href={
                'https://github.com/nibdo/bloben-calendar/blob/production/package.json'
              }
              onClick={() =>
                window.open(
                  'https://github.com/nibdo/bloben-calendar/blob/production/package.json',
                  '_blank'
                )
              }
            >
              Calendar packages
            </Link>{' '}
          </Text>
          <Separator height={8} />
          <Text fontSize="md">
            <Link
              _focus={{ boxShadow: 'none' }}
              target={'_blank'}
              color={store.isDark ? 'pink.300' : 'pink.500'}
              href={
                'https://github.com/nibdo/bloben-admin/blob/production/package.json'
              }
              onClick={() =>
                window.open(
                  'https://github.com/nibdo/bloben-admin/blob/production/package.json',
                  '_blank'
                )
              }
            >
              Admin packages
            </Link>{' '}
          </Text>
          <Separator height={8} />
          <Text fontSize="md">
            <Link
              _focus={{ boxShadow: 'none' }}
              target={'_blank'}
              color={store.isDark ? 'pink.300' : 'pink.500'}
              href={
                'https://github.com/nibdo/bloben-api/blob/production/package.json'
              }
              onClick={() =>
                window.open(
                  'https://github.com/nibdo/bloben-api/blob/production/package.json',
                  '_blank'
                )
              }
            >
              Server packages
            </Link>{' '}
          </Text>
        </div>
      </SettingsCard>
    </>
  );
};

export default HelpSettings;
