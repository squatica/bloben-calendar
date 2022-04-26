import './SettingsMenu.scss';
import { Button, Stack } from '@chakra-ui/react';
import { Context } from '../../../context/store';
import { EvaIcons } from 'components/eva-icons';
import { SETTINGS_PATHS } from '../../../types/enums';
import { parseCssDark } from 'utils/common';
import CalendarIcon from '../../../components/eva-icons/calendar';
import Email from '../../../components/eva-icons/email';
import PersonIcon from '../../../components/eva-icons/person';
import React, { useContext } from 'react';
import SettingsIcon from '../../../components/eva-icons/settings';

interface SettingsButtonProps {
  onClick: any;
  icon: any;
  text: string;
  path: SETTINGS_PATHS;
  selected: string;
}
const SettingsButton = (props: SettingsButtonProps) => {
  return (
    <Button
      _focus={{ boxShadow: 'none' }}
      leftIcon={props.icon}
      variant={props.selected === props.path ? 'solid' : 'ghost'}
      onClick={props.onClick}
      isFullWidth={true}
      justifyContent={'flex-start'}
      fontSize={14}
    >
      {props.text}
    </Button>
  );
};

interface SettingsMenuProps {
  setSelected: any;
  selected: string;
}
const SettingsMenu = (props: SettingsMenuProps) => {
  const { setSelected, selected } = props;

  const [store] = useContext(Context);
  const { isMobile } = store;

  return (
    <div className={'SettingsMenu__wrapper'}>
      <Stack
        direction="column"
        spacing={1}
        width={isMobile ? '100%' : undefined}
      >
        <SettingsButton
          selected={selected}
          path={SETTINGS_PATHS.ACCOUNTS}
          onClick={() => {
            setSelected(SETTINGS_PATHS.ACCOUNTS);
          }}
          text={'Accounts'}
          icon={
            <PersonIcon
              className={parseCssDark('SettingsMenu__icon', store.isDark)}
            />
          }
        />
        <SettingsButton
          selected={selected}
          path={SETTINGS_PATHS.CALENDARS}
          onClick={() => {
            setSelected(SETTINGS_PATHS.CALENDARS);
          }}
          text={'Calendars'}
          icon={
            <CalendarIcon
              className={parseCssDark('SettingsMenu__icon', store.isDark)}
            />
          }
        />
        <SettingsButton
          selected={selected}
          path={SETTINGS_PATHS.GENERAL}
          onClick={() => {
            setSelected(SETTINGS_PATHS.GENERAL);
          }}
          text={'General'}
          icon={
            <SettingsIcon
              className={parseCssDark('SettingsMenu__icon', store.isDark)}
            />
          }
        />
        <SettingsButton
          selected={selected}
          path={SETTINGS_PATHS.EMAIL_CONFIG}
          onClick={() => {
            setSelected(SETTINGS_PATHS.EMAIL_CONFIG);
          }}
          text={'Email'}
          icon={
            <Email
              className={parseCssDark('SettingsMenu__icon', store.isDark)}
            />
          }
        />
        {/*<SettingsButton*/}
        {/*  selected={selected}*/}
        {/*  path={SETTINGS_PATHS.RESET}*/}
        {/*  onClick={() => {*/}
        {/*    setSelected(SETTINGS_PATHS.RESET);*/}
        {/*  }}*/}
        {/*  text={"Reset"}*/}
        {/*  icon={<EvaIcons.Trash className={"SettingsMenu__icon"} />}*/}
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
        {/*<SettingsButton*/}
        {/*  onClick={() => {}}*/}
        {/*  text={'Syncing'}*/}
        {/*  icon={<Sync className={'SettingsMenu__icon'} />}*/}
        {/*/>*/}
      </Stack>
    </div>
  );
};

export default SettingsMenu;
