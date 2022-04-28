import './Settings.scss';
import React, { useContext, useState } from 'react';

import { Context } from '../../context/store';
import { Flex } from '@chakra-ui/react';
import { SETTINGS_PATHS } from '../../types/enums';
import { parseCssDark } from '../../utils/common';
import ModalNew from '../../components/modalNew/ModalNew';
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
  // const [height, setHeight] = useState(0);

  // useEffect(() => {
  //   const element = document.querySelector('.chakra-modal__body');
  //   if (element) {
  //     const rect = element.getBoundingClientRect();
  //     setHeight(rect.height - 8);
  //   }
  // }, []);

  // useEffect(() => {
  //   const element = document.querySelector('.chakra-modal__body');
  //   if (element) {
  //     const rect = element.getBoundingClientRect();
  //     setHeight(rect.height - 8);
  //   }
  // }, [
  //   document.querySelector('.chakra-modal__content')?.getBoundingClientRect()
  //     .height,
  // ]);

  return isMobile ? (
    <Flex>
      {store.settingsOpen ? (
        <div className={parseCssDark('Settings__wrapper', store.isDark)}>
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
  ) : store.settingsOpen ? (
    <ModalNew handleClose={handleClose} className={'SettingsModal'}>
      <div className={parseCssDark('Settings__wrapper', store.isDark)}>
        <div className={'Settings__content__row'}>
          <SettingsMenu setSelected={setSelected} selected={selected} />
          <SettingsContent selected={selected} />
        </div>
      </div>
    </ModalNew>
  ) : null;
};

export default Settings;
