import { ITEM_SIZE } from '../../../types/enums';
import { Stack } from '@chakra-ui/react';
import ChakraTimezoneSelect from '../../chakraCustom/ChakraTimezoneSelect';
import React from 'react';

interface EventDetailTimezoneProps {
  timezone: string;
  selectTimezone: any;
  isDisabled?: boolean;
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const EventDetailTimezone = (props: EventDetailTimezoneProps) => {
  const { timezone, selectTimezone, isDisabled } = props;

  return (
    <Stack direction={'row'} align={'center'} style={{ width: '100%' }}>
      <ChakraTimezoneSelect
        onSelect={selectTimezone}
        value={timezone}
        isDisabled={isDisabled}
        size={ITEM_SIZE.SMALL}
      />
    </Stack>
  );
};

export default EventDetailTimezone;
