import { Button, Center, Stack } from '@chakra-ui/react';
import { CALENDAR_EVENT_TYPE } from 'kalend/common/interface';
import { CalendarView } from 'kalend';
import { Context, StoreContext } from '../../context/store';
import React, { useContext } from 'react';

export const eventTypeItems = [
  {
    label: 'Task',
    value: CALENDAR_EVENT_TYPE.TASK,
  },
  {
    label: 'Event',
    value: CALENDAR_EVENT_TYPE.EVENT,
  },
];

export const calendarHeaderItems = [
  {
    label: 'Agenda',
    value: CalendarView.AGENDA,
  },
  {
    label: 'Day',
    value: CalendarView.DAY,
  },
  {
    label: 'Three days',
    value: CalendarView.THREE_DAYS,
    width: 24,
  },
  {
    label: 'Week',
    value: CalendarView.WEEK,
    width: 24,
  },
  {
    label: 'Month',
    value: CalendarView.MONTH,
    width: 24,
  },
];

interface ButtonStackItem {
  label: string;
  value: string;
  width?: number;
}

interface ButtonStackProps {
  onClick: any;
  items: ButtonStackItem[];
  selectedValue: string;
  style?: any;
  disabled?: boolean;
}
const ButtonStack = (props: ButtonStackProps) => {
  const { onClick, items, selectedValue, style, disabled } = props;
  const [store]: [StoreContext, any] = useContext(Context);

  return (
    <Center margin={'0 auto'} style={style}>
      <Stack
        spacing={0}
        direction={'row'}
        border={store.isDark ? '' : 'solid 0.4px #E2E8F0'}
        borderRadius={4}
      >
        {items.map((item) => {
          const { label, value, width } = item;

          return (
            <Button
              key={value}
              _focus={{ boxShadow: 'none' }}
              variant={value === selectedValue ? 'solid' : 'ghost'}
              fontSize={12}
              width={width || 20}
              fontWeight={value === selectedValue ? 'bold' : 'normal'}
              size={'sm'}
              onClick={() => onClick(value)}
              disabled={disabled}
            >
              {label}
            </Button>
          );
        })}
      </Stack>
    </Center>
  );
};

export default ButtonStack;
