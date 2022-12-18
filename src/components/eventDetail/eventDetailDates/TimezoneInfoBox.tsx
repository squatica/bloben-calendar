import { ALERT_BOX_TYPE } from '../../../enums';
import { Context, StoreContext } from '../../../context/store';
import { ReduxState } from '../../../types/interface';
import { Stack } from '@chakra-ui/react';
import { getLocalTimezone } from '../../../utils/common';
import { useSelector } from 'react-redux';
import AlertBox from '../../chakraCustom/AlertBox';
import Datez from 'datez';
import FormIcon from '../../formIcon/FormIcon';
import LuxonHelper from '../../../utils/LuxonHelper';
import React, { useContext } from 'react';

interface TimezoneInfoBoxProps {
  timezoneStartAt?: string;
  timezoneEndAt?: string;
  startDate: string;
  endDate?: string;
  showInDifferentTimezone?: boolean;
}

const formatAsEdit = (
  startDate: string,
  endDate: string | undefined,
  localTimezone: string
) => {
  return `${LuxonHelper.parseToDateTime(startDate)
    .setZone(localTimezone)
    .toFormat('d LLL HH:mm')}${
    endDate
      ? ` -
                  ${LuxonHelper.parseToDateTime(endDate)
                    .setZone(localTimezone)
                    .toFormat('d LLL HH:mm')}`
      : ''
  } in ${localTimezone}`;
};

const formatAsView = (
  startDate: string,
  endDate: string | undefined,
  startAtTimezone?: string,
  endAtTimezone?: string
) => {
  if (!startAtTimezone) {
    return '';
  }

  return `${Datez.setZone(
    LuxonHelper.parseToDateTime(startDate),
    startAtTimezone
  ).toFormat('d LLL HH:mm')}${
    endDate && endAtTimezone
      ? ` -
                  ${Datez.setZone(
                    LuxonHelper.parseToDateTime(endDate),
                    endAtTimezone
                  ).toFormat('d LLL HH:mm')}`
      : ''
  } in ${startAtTimezone} ${
    startAtTimezone !== endAtTimezone ? `- ${endAtTimezone}` : ''
  }`;
};

const TimezoneInfoBox = (props: TimezoneInfoBoxProps) => {
  const {
    timezoneStartAt,
    timezoneEndAt,
    startDate,
    endDate,
    showInDifferentTimezone,
  } = props;

  const [store]: [StoreContext] = useContext(Context);
  const { isDark } = store;

  const settings = useSelector((state: ReduxState) => state.calendarSettings);
  const localTimezone = settings.timezone || getLocalTimezone();

  return (timezoneStartAt && timezoneStartAt !== localTimezone) ||
    (timezoneEndAt && timezoneEndAt !== localTimezone) ? (
    <Stack direction={'row'} align={'center'} style={{ width: '100%' }}>
      <FormIcon allVisible hidden isDark={isDark}>
        <div />
      </FormIcon>
      <AlertBox
        type={ALERT_BOX_TYPE.INFO}
        title={''}
        description={
          showInDifferentTimezone
            ? formatAsView(startDate, endDate, timezoneStartAt, timezoneEndAt)
            : formatAsEdit(startDate, endDate, localTimezone)
        }
        hideIcon={true}
      />
    </Stack>
  ) : null;
};

export default TimezoneInfoBox;
