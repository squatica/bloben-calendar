import './SettingsContent.scss';
import { SETTINGS_PATHS } from '../../../types/enums';
import AboutSettings from '../settingsParts/AboutSettings';
import AcknowledgmentSettings from '../settingsParts/AcknowledgmentSettings';
import HelpSettings from '../settingsParts/HelpSettings';
import React from 'react';

interface SettingsContentPublicProps {
  selected: string;
}
const SettingsContentPublic = (props: SettingsContentPublicProps) => {
  const { selected } = props;
  return (
    <div className={'SettingsContent__container'}>
      {/*{selected === SETTINGS_PATHS.GENERAL ? <GeneralSettings /> : null}*/}
      {selected === SETTINGS_PATHS.HELP ? <HelpSettings /> : null}
      {selected === SETTINGS_PATHS.ACKNOWLEDGMENTS ? (
        <AcknowledgmentSettings />
      ) : null}
      {selected === SETTINGS_PATHS.ABOUT ? <AboutSettings /> : null}
    </div>
  );
};

export default SettingsContentPublic;
