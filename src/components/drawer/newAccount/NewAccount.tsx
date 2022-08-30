import { Context, StoreContext } from '../../../context/store';
import { EvaIcons } from '../../eva-icons';
import ButtonIcon from '../../button/buttonIcon/ButtonIcon';
import CalDavAccountModal from '../../accountSelectionModal/calDavAccountModal/CalDavAccountModal';
import React, { useContext, useState } from 'react';

const NewCalDavAccountButton = () => {
  const [store]: [StoreContext] = useContext(Context);
  const [isModalOpen, setModalOpen] = useState(false);

  const { isDark } = store;

  const handleOpen = () => {
    setModalOpen(!isModalOpen);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
      <ButtonIcon isDark={isDark} size={'small'} onClick={handleOpen}>
        <EvaIcons.Plus className={'icon-svg-small'} />
      </ButtonIcon>
      {isModalOpen ? <CalDavAccountModal handleClose={handleOpen} /> : null}
    </div>
  );
};

export default NewCalDavAccountButton;
