import { Button, Menu, MenuButton, MenuList, Text } from '@chakra-ui/react';
import { DateTime } from 'luxon';
import DatePicker from '../../../../../components/datePicker/DatePicker';
import React from 'react';

const EndOnDate = (props: {
  onDate: {
    date: string;
    options: (weekStartsOnSunday: boolean, calendarComponent: any) => any;
  };
  handleChange: any;
}) => {
  const { onDate, handleChange } = props;

  return (
    <Menu isLazy>
      <MenuButton
        as={Button}
        _focus={{ boxShadow: 'none' }}
        style={{ width: 120 }}
      >
        <Text style={{ fontWeight: 'normal' }}>
          {DateTime.fromFormat(onDate.date, 'yyyy-MM-dd')
            .minus({ day: 1 })
            .toFormat('dd.MM.yyyy')
            .toString()}
        </Text>
      </MenuButton>
      <MenuList>
        <DatePicker
          width={250}
          sideMargin={6}
          selectDate={(date: DateTime) => {
            const editedEvent = {
              target: {
                value: date.plus({ day: 1 }).toFormat('yyyy-MM-dd'),
                name: 'end.onDate.date',
              },
            };

            handleChange(editedEvent);
          }}
          selectedDate={DateTime.fromFormat(onDate.date, 'yyyy-MM-dd')
            .minus({ day: 1 })
            .toString()}
          withInput
        />
      </MenuList>
    </Menu>
  );
};

export default EndOnDate;
