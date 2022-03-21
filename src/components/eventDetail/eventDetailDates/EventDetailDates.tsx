import React, { useContext } from 'react';

import '../EventDetail.scss';
import './EventDetailDates.scss';

import { AppSettings, ReduxState } from '../../../types/interface';
import {
  Button,
  Checkbox,
  Menu,
  MenuButton,
  MenuList,
  Stack,
  Text,
} from '@chakra-ui/react';
import { Context } from '../../../context/store';
import { EvaIcons } from 'components/eva-icons';
import { parseToDateTime } from 'utils/datetimeParser';
import { useSelector } from 'react-redux';
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
  timezoneStartAt: string;
  handleChangeDateFrom: any;
  handleChangeDateTill: any;
  endDate: string;
  timezoneEndAt: string;
  allDay: boolean;
  setStartTimezone: any;
  setForm: any;
}
const EventDetailDates = (props: EventDetailDatesProps) => {
  const {
    startDate,
    timezoneStartAt,
    handleChangeDateFrom,
    handleChangeDateTill,
    endDate,
    timezoneEndAt,
    allDay,
    setForm,
  } = props;
  const settings: AppSettings = useSelector(
    (state: ReduxState) => state.settings
  );
  const [store] = useContext(Context);
  const { isDark, isMobile } = store;

  const width: number = useWidth();

  const startDateFormatted: string = formatDate(startDate, timezoneStartAt);
  const startTimeFormatted: string = formatTime(startDate, timezoneStartAt);
  const endDateFormatted: string = formatDate(endDate, timezoneEndAt);
  const endTimeFormatted: string = formatTime(endDate, timezoneEndAt);

  const startDateString: string = LuxonHelper.setTimezone(
    startDate,
    timezoneStartAt
  );
  const endDateString: string = LuxonHelper.setTimezone(
    endDate,
    timezoneStartAt
  );
  const pickerWidth: number = isMobile ? width - 48 : 250;

  const handleSetAllDay = () => {
    if (allDay) {
      setForm('timezoneStartAt', settings.timezone);
      setForm('timezoneEndAt', settings.timezone);
    }
    setForm(
      'startAt',
      parseToDateTime(startDate, !allDay ? 'floating' : settings.timezone)
        .set({
          hour: 0,
          minute: 0,
          second: 0,
        })
        .toString()
    );
    setForm(
      'endAt',
      parseToDateTime(endDate, !allDay ? 'floating' : settings.timezone)
        .set({
          hour: 0,
          minute: 0,
          second: 0,
        })
        .toString()
    );
    setForm('allDay', !allDay);
  };

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
            {allDay ? null : (
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
                    timezone={timezoneStartAt}
                    selectTime={handleChangeDateFrom}
                    selectedDate={startDateString}
                  />
                </MenuList>
              </Menu>
            )}
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
            {allDay ? null : (
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
                    timezone={timezoneStartAt}
                    selectTime={handleChangeDateTill}
                    selectedDate={endDateString}
                  />
                </MenuList>
              </Menu>
            )}
          </Stack>
        </Stack>
      </Stack>
      <Stack direction={'row'} align={'center'} style={{ width: '100%' }}>
        <FormIcon allVisible hidden isDark={isDark}>
          <EvaIcons.Clock className={'EventDetail-icon'} />
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
            <Text style={{ paddingRight: 14 }}>All day</Text>
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
