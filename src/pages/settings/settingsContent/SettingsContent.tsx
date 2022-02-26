import './SettingsContent.scss';
import { SETTINGS_PATHS } from '../../../types/enums';
import AboutSettings from '../settingsParts/AboutSettings';
import AccountSettings from '../settingsParts/AccountSettings';
import AcknowledgmentSettings from '../settingsParts/AcknowledgmentSettings';
import GeneralSettings from '../settingsParts/GeneralSettings';
import HelpSettings from '../settingsParts/HelpSettings';
import React from 'react';
import ResetSettings from '../settingsParts/ResetSettings';

interface SettingsContentProps {
  selected: string;
}
const SettingsContent = (props: SettingsContentProps) => {
  const { selected } = props;
  return (
    <div className={'SettingsContent__container'}>
      {selected === SETTINGS_PATHS.GENERAL ? <GeneralSettings /> : null}
      {selected === SETTINGS_PATHS.ACCOUNTS ? <AccountSettings /> : null}
      {selected === SETTINGS_PATHS.RESET ? <ResetSettings /> : null}
      {selected === SETTINGS_PATHS.HELP ? <HelpSettings /> : null}
      {selected === SETTINGS_PATHS.ACKNOWLEDGMENTS ? (
        <AcknowledgmentSettings />
      ) : null}
      {selected === SETTINGS_PATHS.ABOUT ? <AboutSettings /> : null}
    </div>
  );
};

export default SettingsContent;
