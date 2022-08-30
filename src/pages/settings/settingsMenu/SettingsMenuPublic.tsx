import './SettingsMenu.scss';
import { Context, StoreContext } from '../../../context/store';
import { EvaIcons } from '../../../components/eva-icons';
import { SETTINGS_PATHS } from '../../../types/enums';
import { SettingsButton } from './SettingsMenu';
import { Stack } from '@chakra-ui/react';
import { parseCssDark } from '../../../utils/common';
import React, { useContext } from 'react';

interface SettingsMenuPublicProps {
  setSelected: any;
  selected: string;
}
const SettingsMenuPublic = (props: SettingsMenuPublicProps) => {
  const { setSelected, selected } = props;

  const [store]: [StoreContext] = useContext(Context);
  const { isMobile } = store;

  return (
    <div className={'SettingsMenu__wrapper'}>
      <Stack
        direction="column"
        spacing={1}
        width={isMobile ? '100%' : undefined}
      >
        {/*<SettingsButton*/}
        {/*  selected={selected}*/}
        {/*  path={SETTINGS_PATHS.GENERAL}*/}
        {/*  onClick={() => {*/}
        {/*    setSelected(SETTINGS_PATHS.GENERAL);*/}
        {/*  }}*/}
        {/*  text={'General'}*/}
        {/*  icon={*/}
        {/*    <SettingsIcon*/}
        {/*      className={parseCssDark('SettingsMenu__icon', store.isDark)}*/}
        {/*    />*/}
        {/*  }*/}
        {/*/>*/}
        <SettingsButton
          selected={selected}
          path={SETTINGS_PATHS.HELP}
          onClick={() => {
            setSelected(SETTINGS_PATHS.HELP);
          }}
          text={'Help'}
          icon={
            <EvaIcons.QuestionCircle
              className={parseCssDark('SettingsMenu__icon', store.isDark)}
            />
          }
        />
        <SettingsButton
          selected={selected}
          path={SETTINGS_PATHS.ACKNOWLEDGMENTS}
          onClick={() => {
            setSelected(SETTINGS_PATHS.ACKNOWLEDGMENTS);
          }}
          text={'Acknowledgment'}
          icon={
            <EvaIcons.Note
              className={parseCssDark('SettingsMenu__icon', store.isDark)}
            />
          }
        />
        <SettingsButton
          selected={selected}
          path={SETTINGS_PATHS.ABOUT}
          onClick={() => {
            setSelected(SETTINGS_PATHS.ABOUT);
          }}
          text={'About'}
          icon={
            <EvaIcons.Info
              className={parseCssDark('SettingsMenu__icon', store.isDark)}
            />
          }
        />
      </Stack>
    </div>
  );
};

export default SettingsMenuPublic;
