import { Button, Flex, Spacer, Text } from '@chakra-ui/react';
import { Context } from '../../context/store';
import { REPEATED_EVENT_CHANGE_TYPE } from '../../bloben-interface/enums';
import ModalNew from '../modalNew/ModalNew';
import PrimaryButton from '../chakraCustom/primaryButton/PrimaryButton';
import RadioOff from '../eva-icons/radio-off';
import RadioOn from '../eva-icons/radio-on';
import React, { useContext, useState } from 'react';

export enum REPEAT_MODAL_TYPE {
  DELETE = 'DELETE',
  UPDATE = 'UPDATE',
}

const parseToText = (
  type: REPEAT_MODAL_TYPE,
  value: REPEATED_EVENT_CHANGE_TYPE
) => {
  if (type === REPEAT_MODAL_TYPE.UPDATE) {
    if (value === REPEATED_EVENT_CHANGE_TYPE.SINGLE) {
      return 'Update this event';
    } else if (value === REPEATED_EVENT_CHANGE_TYPE.THIS_AND_FUTURE) {
      return 'Update this and next events';
    } else if (value === REPEATED_EVENT_CHANGE_TYPE.ALL) {
      return 'Update all events';
    }
  } else {
    if (value === REPEATED_EVENT_CHANGE_TYPE.SINGLE) {
      return 'Delete this event';
    } else if (value === REPEATED_EVENT_CHANGE_TYPE.THIS_AND_FUTURE) {
      return 'Delete this and next events';
    } else if (value === REPEATED_EVENT_CHANGE_TYPE.ALL) {
      return 'Delete all events';
    }
  }
};

const RadioItem = (props: {
  value: REPEATED_EVENT_CHANGE_TYPE;
  thisValue: REPEATED_EVENT_CHANGE_TYPE;
  type: REPEAT_MODAL_TYPE;
  handleSelect: any;
}) => {
  const [store] = useContext(Context);
  const { isDark } = store;
  const { value, thisValue, handleSelect, type } = props;
  const isChecked = value === thisValue;

  return (
    <Button
      variant={'ghost'}
      bg={'transparent'}
      color={isDark ? 'gray.200' : 'gray.800'}
      onClick={() => handleSelect(thisValue)}
      isFullWidth={true}
      style={{ justifyContent: 'flex-start', alignItems: 'center' }}
    >
      {isChecked ? (
        <RadioOn
          style={{
            fill: isDark ? 'whitesmoke' : 'pink.500',
            width: 20,
          }}
        />
      ) : (
        <RadioOff
          style={{
            fill: isDark ? 'whitesmoke' : 'gray',
            width: 20,
          }}
        />
      )}
      <Text style={{ marginLeft: 8 }}>{parseToText(type, thisValue)}</Text>
    </Button>
  );
};

interface RepeatEventModalProps {
  handleClose: any;
  title: string;
  handleClick: any;
  type: REPEAT_MODAL_TYPE;
}
const RepeatEventModal = (props: RepeatEventModalProps) => {
  const [value, setValue] = useState<REPEATED_EVENT_CHANGE_TYPE>(
    REPEATED_EVENT_CHANGE_TYPE.SINGLE
  );

  const { handleClose, type, handleClick } = props;

  const handleSelect = (newValue: REPEATED_EVENT_CHANGE_TYPE) => {
    setValue(newValue);
  };

  return (
    <ModalNew
      handleClose={handleClose}
      closeButton={true}
      width={200}
      footer={
        <Flex direction={'row'} style={{ marginTop: 2 }}>
          <Spacer />
          <PrimaryButton onClick={() => handleClick(value)}>
            Confirm
          </PrimaryButton>
        </Flex>
      }
    >
      <Flex direction={'column'} alignItems={'flex-start'}>
        <RadioItem
          type={type}
          value={value}
          thisValue={REPEATED_EVENT_CHANGE_TYPE.SINGLE}
          handleSelect={handleSelect}
        />
        {type === REPEAT_MODAL_TYPE.UPDATE ? (
          <RadioItem
            type={type}
            value={value}
            thisValue={REPEATED_EVENT_CHANGE_TYPE.THIS_AND_FUTURE}
            handleSelect={handleSelect}
          />
        ) : null}
        <RadioItem
          type={type}
          value={value}
          thisValue={REPEATED_EVENT_CHANGE_TYPE.ALL}
          handleSelect={handleSelect}
        />
      </Flex>
    </ModalNew>
  );
};

export default RepeatEventModal;
