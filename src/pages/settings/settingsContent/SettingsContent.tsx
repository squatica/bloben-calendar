import './SettingsContent.scss';
import { SETTINGS_PATHS } from '../../../types/enums';
import AboutSettings from '../settingsParts/AboutSettings';
import AccountSettings from '../settingsParts/AccountSettings';
import AcknowledgmentSettings from '../settingsParts/AcknowledgmentSettings';
import CalendarsSettings from '../settingsParts/CalendarsSettings';
import ContactsSettings from '../settingsParts/ContactsSettings';
import EmailConfigSettings from '../settingsParts/EmailConfigSettings';
import GeneralSettings from '../settingsParts/GeneralSettings';
import HelpSettings from '../settingsParts/HelpSettings';
import React from 'react';
import ResetSettings from '../settingsParts/ResetSettings';
import SharedCalendarsSettings from '../settingsParts/SharedCalendarsSettings';

interface SettingsContentProps {
  selected: string;
}
const SettingsContent = (props: SettingsContentProps) => {
  const { selected } = props;
  return (
    <div className={'SettingsContent__container'}>
      {selected === SETTINGS_PATHS.GENERAL ? <GeneralSettings /> : null}
      {selected === SETTINGS_PATHS.ACCOUNTS ? <AccountSettings /> : null}
      {selected === SETTINGS_PATHS.CALENDARS ? <CalendarsSettings /> : null}
      {selected === SETTINGS_PATHS.SHARED_CALENDARS ? (
        <SharedCalendarsSettings />
      ) : null}
      {selected === SETTINGS_PATHS.RESET ? <ResetSettings /> : null}
      {selected === SETTINGS_PATHS.HELP ? <HelpSettings /> : null}
      {selected === SETTINGS_PATHS.EMAIL_CONFIG ? (
        <EmailConfigSettings />
      ) : null}
      {selected === SETTINGS_PATHS.ACKNOWLEDGMENTS ? (
        <AcknowledgmentSettings />
      ) : null}
      {selected === SETTINGS_PATHS.ABOUT ? <AboutSettings /> : null}
      {selected === SETTINGS_PATHS.CONTACTS ? <ContactsSettings /> : null}
    </div>
  );
};

export default SettingsContent;
