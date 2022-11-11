import React, { useContext } from 'react';

import '../EventDetail.scss';
import './EventDetailDates.scss';

import {
  Button,
  Checkbox,
  Menu,
  MenuButton,
  MenuList,
  Stack,
  Text,
} from '@chakra-ui/react';
import { Context, StoreContext } from '../../../context/store';
import { EvaIcons } from 'bloben-components';
import { ReduxState } from '../../../types/interface';
import { getLocalTimezone } from '../../../utils/common';
import { parseTimezone } from '../../../utils/dates';
import { parseToDateTime } from '../../../utils/datetimeParser';
import { useSelector } from 'react-redux';
import { useWidth } from '../../../utils/layout';
import DatePicker from '../../datePicker/DatePicker';
import EventDetailTimezone from '../eventDetailTimezone/EventDetailTimezone';
import FormIcon from '../../formIcon/FormIcon';
import LuxonHelper from '../../../utils/LuxonHelper';
import TimePicker from '../../timePicker/TimePicker';

const SIDE_MARGIN = 24;

const formatDate = (date: string, timezone?: string): string =>
  parseToDateTime(date, timezone).toFormat('d LLL yy');

const formatTime = (date: string, timezone?: string): string =>
  parseToDateTime(date, timezone).toFormat('HH:mm');

interface EventDetailDatesProps {
  startDate: string;
  timezoneStartAt?: string;
  handleChangeDateFrom: any;
  handleChangeDateTill?: any;
  endDate?: string;
  timezoneEndAt?: string;
  allDay: boolean;
  setForm: any;
  hideTimezone?: boolean;
}
const EventDetailDates = (props: EventDetailDatesProps) => {
  const {
    startDate,
    timezoneStartAt,
    timezoneEndAt,
    handleChangeDateFrom,
    handleChangeDateTill,
    endDate,
    allDay,
    setForm,
    hideTimezone,
  } = props;

  const [store]: [StoreContext] = useContext(Context);
  const { isDark, isMobile } = store;

  // Use actual date in timezone which is different from event view where
  // date is in local timezone
  const settings = useSelector((state: ReduxState) => state.calendarSettings);
  const localTimezone = settings.timezone || getLocalTimezone();
  const timezoneStart = timezoneStartAt || getLocalTimezone(); // parseTimezone(timezoneStartAt,
  // settings.timezone);
  const timezoneEnd = parseTimezone(timezoneEndAt, settings.timezone);
  // timezoneEndAt || getLocalTimezone();
  // parseTimezone(timezoneEndAt,
  // settings.timezone);

  const width: number = useWidth();

  const startDateFormatted: string = formatDate(startDate, timezoneStart);
  const startTimeFormatted: string = formatTime(startDate, timezoneStart);
  const endDateFormatted = endDate ? formatDate(endDate, timezoneEndAt) : null;
  const endTimeFormatted = endDate ? formatTime(endDate, timezoneEndAt) : null;

  const startDateTime = parseToDateTime(startDate, timezoneStart);
  const endDateTime = endDate ? parseToDateTime(endDate, timezoneEndAt) : null;

  const startDateString = LuxonHelper.setTimezone(startDate, timezoneStart);
  const endDateString = endDate
    ? LuxonHelper.withZone(endDate, timezoneEnd)
    : null;
  const pickerWidth: number = isMobile ? width - 60 : 250;

  const handleSetAllDay = () => {
    if (allDay) {
      setForm('timezoneStartAt', timezoneStart);
      setForm('timezoneEndAt', timezoneEnd);
    }
    setForm('allDay', !allDay);
  };

  return (
    <>
      <Stack direction={'row'} align={'center'}>
        <FormIcon allVisible isDark={isDark}>
          <EvaIcons.Clock className={'EventDetail-icon'} />
        </FormIcon>
        <Stack
          direction={isMobile ? 'column' : 'row'}
          align={'center'}
          spacing={2}
        >
          <Stack direction={'row'} align={'center'} spacing={2}>
            <Menu isLazy>
              <MenuButton
                as={Button}
                _focus={{ boxShadow: 'none' }}
                style={{ width: isMobile ? 120 : 90 }}
              >
                <Text style={{ fontWeight: 'normal' }}>
                  {startDateFormatted}
                </Text>
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
            {allDay ? null : (
              <Menu isLazy>
                <MenuButton
                  as={Button}
                  _focus={{ boxShadow: 'none' }}
                  style={{ width: isMobile ? 80 : 70 }}
                >
                  <Text style={{ fontWeight: 'normal' }}>
                    {startTimeFormatted}
                  </Text>
                </MenuButton>
                <MenuList style={{ width: 150 }}>
                  <TimePicker
                    width={150}
                    timezone={timezoneStartAt || localTimezone}
                    selectTime={handleChangeDateFrom}
                    selectedDate={startDateTime}
                  />
                </MenuList>
              </Menu>
            )}
          </Stack>
          {!isMobile && endDateFormatted && endDateString ? <p>-</p> : null}
          {endDateFormatted && endDateString ? (
            <Stack direction={'row'} align={'center'} spacing={2}>
              <Menu isLazy>
                <MenuButton
                  as={Button}
                  _focus={{ boxShadow: 'none' }}
                  style={{ width: isMobile ? 120 : 90 }}
                >
                  <Text style={{ fontWeight: 'normal' }}>
                    {endDateFormatted}
                  </Text>
                </MenuButton>
                <MenuList>
                  <DatePicker
                    width={pickerWidth}
                    sideMargin={SIDE_MARGIN}
                    selectDate={handleChangeDateTill}
                    selectedDate={startDate}
                    withInput
                  />
                </MenuList>
              </Menu>
              {allDay ? null : (
                <Menu isLazy>
                  <MenuButton
                    as={Button}
                    _focus={{ boxShadow: 'none' }}
                    style={{ width: isMobile ? 80 : 70 }}
                  >
                    <Text style={{ fontWeight: 'normal' }}>
                      {endTimeFormatted}
                    </Text>
                  </MenuButton>
                  {endDateTime ? (
                    <MenuList>
                      <TimePicker
                        width={pickerWidth}
                        timezone={
                          timezoneEndAt || timezoneStartAt || localTimezone
                        }
                        selectTime={handleChangeDateTill}
                        selectedDate={endDateTime}
                      />
                    </MenuList>
                  ) : null}
                </Menu>
              )}
            </Stack>
          ) : null}
        </Stack>
      </Stack>
      {timezoneStartAt && !hideTimezone && !allDay ? (
        <Stack direction={'row'} align={'center'} style={{ width: '100%' }}>
          <FormIcon allVisible hidden isDark={isDark}>
            <div />
          </FormIcon>
          <EventDetailTimezone
            timezone={timezoneStartAt}
            selectTimezone={(item: { label: string; value: string }) => {
              setForm('timezoneStartAt', item.value);
            }}
            isDisabled={allDay}
          />
          <EventDetailTimezone
            timezone={timezoneEndAt || timezoneStartAt}
            selectTimezone={(item: { label: string; value: string }) => {
              setForm('timezoneEndAt', item.value);
            }}
            isDisabled={allDay}
          />
        </Stack>
      ) : null}
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
          <Button
            variant={'ghost'}
            onClick={handleSetAllDay}
            _focus={{ boxShadow: 'none' }}
          >
            <Text style={{ paddingRight: 14, fontWeight: 'normal' }}>
              All day
            </Text>
            <Checkbox
              type={'checkbox'}
              size={'lg'}
              _focus={{ boxShadow: 'none' }}
              colorScheme={'pink'}
              isChecked={allDay}
              onChange={handleSetAllDay}
            />
          </Button>
        </Stack>
      </Stack>
    </>
  );
};

export default EventDetailDates;
