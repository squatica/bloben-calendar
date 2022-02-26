import './Settings.scss';
import React, { useContext, useState } from 'react';

import { Context } from '../../context/store';
import { Flex } from '@chakra-ui/react';
import { SETTINGS_PATHS } from '../../types/enums';
import ChakraModal from '../../components/chakraCustom/ChakraModal';
import SettingsContent from './settingsContent/SettingsContent';
import SettingsMenu from './settingsMenu/SettingsMenu';
import VersionFooter from '../../components/versionFooter/VersionFooter';

const Settings = () => {
  const [store, dispatchContext] = useContext(Context);
  const setContext = (type: string, payload: any) => {
    dispatchContext({ type, payload });
  };
  const { isMobile } = store;

  const [selected, setSelected] = useState(
    isMobile ? '' : SETTINGS_PATHS.ACCOUNTS
  );

  const handleClose = () => setContext('settingsOpen', false);

  return isMobile ? (
    <Flex>
      {store.settingsOpen ? (
        <div className={'Settings__wrapper'}>
          {selected === '' ? (
            <>
              <SettingsMenu setSelected={setSelected} selected={selected} />
              <VersionFooter isDark={false} />
            </>
          ) : (
            <SettingsContent selected={selected} />
          )}
        </div>
      ) : (
        <div />
      )}
    </Flex>
  ) : (
    <ChakraModal
      isOpen={store.settingsOpen}
      handleClose={handleClose}
      minWidth={800}
      height={'70%'}
    >
      {store.settingsOpen ? (
        <div className={'Settings__wrapper'}>
          <div className={'Settings__content__row'}>
            <SettingsMenu setSelected={setSelected} selected={selected} />
            <SettingsContent selected={selected} />
          </div>
          <VersionFooter isDark={false} />
        </div>
      ) : (
        <div />
      )}
    </ChakraModal>
  );
};

export default Settings;
