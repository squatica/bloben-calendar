import React, { useContext } from 'react';

import { Context } from '../../../context/store';
import { EvaIcons } from 'components/eva-icons';
import { Input, Stack } from '@chakra-ui/react';
import FormIcon from '../../formIcon/FormIcon';

interface EventDetailLocationProps {
  handleChange?: any;
  value: string;
  disabled?: boolean;
}
const EventDetailLocation = (props: EventDetailLocationProps) => {
  const { value, handleChange, disabled } = props;

  const [store] = useContext(Context);
  const { isDark } = store;

  return (
    <Stack
      direction={'row'}
      align={'center'}
      style={{
        width: '100%',
      }}
    >
      <FormIcon isDark={isDark} allVisible>
        <EvaIcons.Pin className={'EventDetail-icon'} />
      </FormIcon>
      <Input
        size={'md'}
        type="text"
        placeholder="Location"
        name={'location'}
        value={value}
        variant={disabled ? 'unstyled' : 'outline'}
        onChange={handleChange}
        isDisabled={disabled}
        autoComplete={'off'}
      />
    </Stack>
  );
};

export default EventDetailLocation;
