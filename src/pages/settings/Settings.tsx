import './Settings.scss';
import React, { useContext, useEffect, useState } from 'react';

import { Context } from '../../context/store';
import { Flex } from '@chakra-ui/react';
import { SETTINGS_PATHS } from '../../types/enums';
import ChakraModal from '../../components/chakraCustom/ChakraModal';
import SettingsContent from './settingsContent/SettingsContent';
import SettingsMenu from './settingsMenu/SettingsMenu';

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
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const element = document.querySelector('.chakra-modal__body');
    if (element) {
      const rect = element.getBoundingClientRect();
      setHeight(rect.height - 8);
    }
  }, []);

  useEffect(() => {
    const element = document.querySelector('.chakra-modal__body');
    if (element) {
      const rect = element.getBoundingClientRect();
      setHeight(rect.height - 8);
    }
  }, [
    document.querySelector('.chakra-modal__content')?.getBoundingClientRect()
      .height,
  ]);

  return isMobile ? (
    <Flex>
      {store.settingsOpen ? (
        <div className={'Settings__wrapper'} style={{ maxHeight: height }}>
          {selected === '' ? (
            <>
              <SettingsMenu setSelected={setSelected} selected={selected} />
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
        </div>
      ) : (
        <div />
      )}
    </ChakraModal>
  );
};

export default Settings;
