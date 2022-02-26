import './SettingsFooter.scss';
import { debug } from '../../../utils/debug';
import { initialReduxState } from '../../../redux/reducers';
import { replace } from '../../../redux/actions';
import { useDispatch } from 'react-redux';
import ButtonBase from '../../../components/button/buttonBase/ButtonBase';
import React from 'react';

const SettingsFooter = () => {
  const dispatch = useDispatch();

  const resetApp = async () => {
    debug('Logging out');
    // await LocalForage.setItem('root', {});
    dispatch(replace(initialReduxState));
  };

  return (
    <div className={'SettingsFooter__container'}>
      <ButtonBase isDark={false} onClick={resetApp}>
        Logout
      </ButtonBase>
    </div>
  );
};

export default SettingsFooter;
