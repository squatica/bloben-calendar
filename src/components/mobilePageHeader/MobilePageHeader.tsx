import './MobilePageHeader.scss';
import { Context, StoreContext } from '../../context/store';
import { ITEM_SIZE } from '../../types/enums';
import { IconButton, Text } from '@chakra-ui/react';
import { parseCssDark } from '../../utils/common';
import { useNavigate } from 'react-router-dom';
import ArrowBack from '../eva-icons/arrow-back';
import React, { useContext } from 'react';

interface MobilePageHeaderProps {
  handleClose?: any;
  title?: string;
}

const MobilePageHeader = (props: MobilePageHeaderProps) => {
  const [store]: [StoreContext] = useContext(Context);
  const { isDark } = store;

  const { handleClose, title } = props;
  const navigate = useNavigate();

  const goBack = () => navigate(-1);

  return (
    <div className={parseCssDark('MobilePageHeaderContainer', isDark)}>
      <IconButton
        _focus={{ boxShadow: 'none' }}
        variant={'ghost'}
        aria-label="Go back"
        icon={
          <ArrowBack
            className={parseCssDark('HeaderModal__icon', store.isDark)}
          />
        }
        isRound
        size={ITEM_SIZE.LARGE}
        autoFocus={false}
        onClick={handleClose ? handleClose : goBack}
      />
      {title ? (
        <Text
          fontWeight={'bold'}
          fontSize={ITEM_SIZE.LARGE}
          style={{ marginLeft: 4 }}
        >
          {title}
        </Text>
      ) : null}
    </div>
  );
};

export default MobilePageHeader;
