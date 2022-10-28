import { CalDavCalendar, ReduxState } from '../../../types/interface';
import { ChakraInput } from 'bloben-components';
import { Flex, Spacer } from '@chakra-ui/react';
import { createTask } from '../../../views/event/editEvent/editTaskHelper';
import { find } from 'lodash';
import { useSelector } from 'react-redux';
import React, { useEffect, useState } from 'react';

interface TaskInputProps {
  selectedCalendarID: string;
  refreshCallback: any;
  disabled: boolean;
}
const TaskInput = (props: TaskInputProps) => {
  const { selectedCalendarID, refreshCallback, disabled } = props;

  const calDavCalendarsRedux: CalDavCalendar[] = useSelector(
    (state: ReduxState) => state.calDavCalendars
  );

  const [calendar, setCalendar] = useState<CalDavCalendar>();

  useEffect(() => {
    const result = find(
      calDavCalendarsRedux,
      (item) => item.id === selectedCalendarID
    );
    setCalendar(result);
  }, [selectedCalendarID]);

  const [summary, setSummary] = useState('');

  const onChange = (e: any) => {
    setSummary(e.target.value);
  };

  const onKeyPress = async (e: any) => {
    if (e.key === 'Enter') {
      await createTask(
        {
          summary,
          prevItem: undefined,
          id: '',
          location: '',
          description: '',
          calendarUrl: calendar?.url || null,
          timezone: null,
          allDay: false,
          startAt: '',
          timezoneStartAt: null,
          endAt: '',
          timezoneEndAt: null,
          color: null,
          isRepeated: false,
          alarms: [],
          createdAt: '',
          updatedAt: '',
          sequence: '',
          organizer: undefined,
          rRule: '',
          props: undefined,
          valarms: undefined,
          attendees: undefined,
          exdates: undefined,
          recurrenceID: undefined,
          status: null,
        },
        true,
        undefined,
        calendar
      );

      setSummary('');

      await refreshCallback(1, selectedCalendarID);
    }
  };

  return (
    <Flex
      direction={'row'}
      alignItems={'center'}
      justifyContent={'flex-start'}
      paddingTop={2}
      paddingBottom={2}
      style={{ padding: 6, paddingLeft: 80 }}
      width={'100%'}
    >
      <ChakraInput
        size={'md'}
        type="text"
        placeholder={'Add task'}
        name={'summary'}
        value={summary}
        variant={'outline'}
        fontWeight={'bold'}
        onChange={onChange}
        autoFocus={false}
        autoComplete={'off'}
        style={{ width: '60%' }}
        onKeyPress={onKeyPress}
        disabled={disabled}
        readOnly={disabled}
      />
      <Spacer />
    </Flex>
  );
};

export default TaskInput;
