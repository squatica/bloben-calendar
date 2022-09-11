import { Context, StoreContext } from '../../../context/store';
import { Stack } from '@chakra-ui/react';
import ChakraTimezoneSelect from '../../chakraCustom/ChakraTimezoneSelect';
import FormIcon from '../../formIcon/FormIcon';
import React, { useContext } from 'react';

interface EventDetailTimezoneProps {
  timezone: string;
  selectTimezone: any;
  isDisabled?: boolean;
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const EventDetailTimezone = (props: EventDetailTimezoneProps) => {
  const { timezone, selectTimezone, isDisabled } = props;
  const [store]: [StoreContext] = useContext(Context);
  const { isDark } = store;

  return (
    <Stack direction={'row'} align={'center'} style={{ width: '100%' }}>
      <FormIcon allVisible hidden isDark={isDark}>
        <div />
      </FormIcon>
      <Stack
        direction={'row'}
        align={'center'}
        spacing={2}
        style={{ width: '100%' }}
      >
        <ChakraTimezoneSelect
          onSelect={selectTimezone}
          value={timezone}
          isDisabled={isDisabled}
        />
      </Stack>
    </Stack>
  );
};

export default EventDetailTimezone;
