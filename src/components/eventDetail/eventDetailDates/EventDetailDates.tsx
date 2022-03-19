import React, { useContext } from 'react';

import '../EventDetail.scss';
import './EventDetailDates.scss';

import { Button, Menu, MenuButton, MenuList, Stack } from '@chakra-ui/react';
import { Context } from '../../../context/store';
import { EvaIcons } from 'components/eva-icons';
import { parseToDateTime } from 'utils/datetimeParser';
import { useWidth } from '../../../utils/layout';
import DatePicker from '../../datePicker/DatePicker';
import FormIcon from '../../formIcon/FormIcon';
import LuxonHelper from 'utils/LuxonHelper';
import TimePicker from '../../timePicker/TimePicker';

const SIDE_MARGIN = 24;

const formatDate = (date: string, timezone: string): string =>
  parseToDateTime(date, timezone).toFormat('d LLL yyyy');

const formatTime = (date: string, timezone: string): string =>
  parseToDateTime(date, timezone).toFormat('HH:mm');

interface EventDetailDatesProps {
  startDate: string;
  timezoneStart: string;
  handleChangeDateFrom: any;
  handleChangeDateTill: any;
  endDate: string;
  timezoneEnd: string;
  allDay: boolean;
  setAllDay: any;
  setStartTimezone: any;
}
const EventDetailDates = (props: EventDetailDatesProps) => {
  const {
    startDate,
    timezoneStart,
    handleChangeDateFrom,
    handleChangeDateTill,
    endDate,
    timezoneEnd,
  } = props;

  const [store] = useContext(Context);
  const { isDark, isMobile } = store;

  const width: number = useWidth();

  const startDateFormatted: string = formatDate(startDate, timezoneStart);
  const startTimeFormatted: string = formatTime(startDate, timezoneStart);
  const endDateFormatted: string = formatDate(endDate, timezoneEnd);
  const endTimeFormatted: string = formatTime(endDate, timezoneEnd);

  const startDateString: string = LuxonHelper.setTimezone(
    startDate,
    timezoneStart
  );
  const endDateString: string = LuxonHelper.setTimezone(endDate, timezoneStart);

  const pickerWidth: number = isMobile ? width - 48 : 250;

  return (
    <>
      <Stack direction={'row'} align={'center'}>
        <FormIcon desktopVisible isDark={isDark}>
          <EvaIcons.Clock className={'EventDetail-icon'} />
        </FormIcon>
        <Stack direction={'row'} align={'center'} spacing={2}>
          <Stack direction={'row'} align={'center'} spacing={2}>
            <Menu isLazy>
              <MenuButton
                as={Button}
                _focus={{ boxShadow: 'none' }}
                style={{ width: 120 }}
              >
                {startDateFormatted}
              </MenuButton>
              <MenuList>
                <DatePicker
                  width={pickerWidth}
                  sideMargin={SIDE_MARGIN}
                  selectDate={handleChangeDateFrom}
                  selectedDate={startDateString}
                  withInput
                />
              </MenuList>
            </Menu>
            <Menu isLazy>
              <MenuButton
                as={Button}
                _focus={{ boxShadow: 'none' }}
                style={{ width: 70 }}
              >
                {startTimeFormatted}
              </MenuButton>
              <MenuList style={{ width: 150 }}>
                <TimePicker
                  width={150}
                  timezone={timezoneStart}
                  selectTime={handleChangeDateFrom}
                  selectedDate={startDateString}
                />
              </MenuList>
            </Menu>
          </Stack>
          <p>-</p>
          <Stack direction={'row'} align={'center'} spacing={2}>
            <Menu isLazy>
              <MenuButton
                as={Button}
                _focus={{ boxShadow: 'none' }}
                style={{ width: 120 }}
              >
                {endDateFormatted}
              </MenuButton>
              <MenuList>
                <DatePicker
                  width={pickerWidth}
                  sideMargin={SIDE_MARGIN}
                  selectDate={handleChangeDateTill}
                  selectedDate={endDateString}
                  withInput
                />
              </MenuList>
            </Menu>
            <Menu isLazy>
              <MenuButton
                as={Button}
                _focus={{ boxShadow: 'none' }}
                style={{ width: 70 }}
              >
                {endTimeFormatted}
              </MenuButton>
              <MenuList>
                <TimePicker
                  width={pickerWidth}
                  timezone={timezoneStart}
                  selectTime={handleChangeDateTill}
                  selectedDate={endDateString}
                />
              </MenuList>
            </Menu>
          </Stack>
        </Stack>
      </Stack>
    </>
  );
};

export default EventDetailDates;
