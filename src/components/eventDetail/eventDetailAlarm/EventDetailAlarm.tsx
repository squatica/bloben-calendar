/* eslint-disable */
import './EventDetailAlarm.scss';

import { useSelector } from 'react-redux';
import React, { useContext, useState } from 'react';

import { Context } from '../../../context/store';
import { EvaIcons } from '../../eva-icons';
import {
  Button,
  Flex,
  IconButton,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spacer,
  Stack,
  Text,
} from '@chakra-ui/react';
import { GetCalendarSettingsResponse } from '../../../bloben-interface/calendarSettings/calendarSettings';
import { AppAlarm, parseCssDark } from '../../../utils/common';
import FormIcon from '../../formIcon/FormIcon';
import ChakraModal from '../../chakraCustom/ChakraModal';
import { ALARM_TYPE } from '../../../bloben-interface/enums';
import { Attendee } from '../../../utils/AttendeeUtils';
import TrashIcon from '../../eva-icons/trash';

const ALARMS_MAX_LENGTH = 4;

const alarmSettings: any = [
  {
    label: 'on start',
    value: {
      alarmType: 'PUSH',
      amount: 0,
      timeUnit: 'minutes',
    },
  },
  {
    label: '10 minutes before',
    value: {
      alarmType: 'PUSH',
      amount: 10,
      timeUnit: 'minutes',
    },
  },
  {
    label: 'hour before',
    value: {
      alarmType: 'PUSH',
      amount: 1,
      timeUnit: 'hours',
    },
  },
  {
    label: 'day before',
    value: {
      alarmType: 'PUSH',
      amount: 1,
      timeUnit: 'days',
    },
  },
  { label: 'custom', value: 'custom' },
];

interface CustomAlarmOptionsProps {
  handleCloseCustomMenu: any;
  addAlarm: any;
  hasEmailAccount: any;
}
const CustomAlarmOptions = (props: CustomAlarmOptionsProps) => {
  const { addAlarm, handleCloseCustomMenu, hasEmailAccount } = props;

  // const calendarSettings: CalendarSettings = useSelector(
  //   (state: any) => state.calendarSettings
  // );

  const defaultDropdownValue: any = {};

  const [value, setValue] = useState('hours');
  const [amount, setAmount] = useState(1);
  const [type, setType] = useState();

  const [store] = useContext(Context);

  const { isDark } = store;

  const handleChange = (event: any) => {
    setAmount(event.target.value);
  };

  const handleValueSelect = (item: any) => {
    setValue(item);
  };

  const saveNotification = (): void => {
    addAlarm({
      label: 'custom',
      value: { amount, alarmType: type, timeUnit: value },
    });
    handleCloseCustomMenu();
  };

  const timeUnitOptions: string[] = ['minutes', 'hours', 'days', 'weeks'];

  const viaOptions: string[] = hasEmailAccount ? ['push', 'email'] : ['push'];

  return (
    <div className={'alarm-settings-container'}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          width: '100%',
          alignItems: 'center',
        }}
      >
        <div style={{ width: '50%', justifyContent: 'flex-end' }}>
          <h4 className={parseCssDark('repeat__subtitle', isDark)}>
            Notification
          </h4>
        </div>
        <div
          style={{ display: 'flex', width: '50%', justifyContent: 'flex-end' }}
        >
          {/*<Button*/}
          {/*  isDark={isDark}*/}
          {/*  onClick={saveNotification}*/}
          {/*  type={NORMAL_BUTTON}*/}
          {/*  text={'Save'}*/}
          {/*/>*/}
        </div>
      </div>
      {/*<div className={'repeat__row'}>*/}
      {/*  <EditEventRepeatValueInput*/}
      {/*    style={{ width: 45 }}*/}
      {/*    type={'number'}*/}
      {/*    name={'amount'}*/}
      {/*    value={amount}*/}
      {/*    onChange={handleChange}*/}
      {/*  />*/}
      {/*  <Label text={'Time unit'} isDark={isDark} />*/}
      {/*  <SegmentedButtons*/}
      {/*    items={timeUnitOptions}*/}
      {/*    onClick={handleValueSelect}*/}
      {/*    isDark={isDark}*/}
      {/*    selectedValue={value}*/}
      {/*  />*/}
      {/*</div>*/}
      {/*<Label text={'Notify via'} isDark={isDark} />*/}
      {/*<SegmentedButtons*/}
      {/*  items={viaOptions}*/}
      {/*  onClick={setType}*/}
      {/*  isDark={isDark}*/}
      {/*  selectedValue={type}*/}
      {/*/>*/}
    </div>
  );
};

const AlarmSelectedValue = () => {
  const [store] = useContext(Context);
  const { isDark, isMobile } = store;

  return (
    <>
      <FormIcon isDark={isDark}>
        <EvaIcons.Bell />
      </FormIcon>
      <Text>Add alarm</Text>
    </>
  );
};

// TODO add custom notification text
const parseAlarmText = (amount: number, timeUnit: string): string => {
  switch (amount) {
    case 0:
      return 'on start';
    case 1:
      return `${timeUnit.slice(0, timeUnit.length - 1)} before`;
    default:
      return `${amount} ${timeUnit} before`;
  }
};

const renderAlarms = (
  alarms: AppAlarm[],
  removeAlarm: any,
  updateAlarm: any
) => {
  return alarms.map((item) => {
    const onChange = (e: any) => {
      updateAlarm({
        ...item,
        amount: e.target.value,
      });
    };

    const handleChange = (key: string, value: any) => {
      const itemClone: any = { ...item };

      itemClone[key] = value;

      updateAlarm(itemClone);
    };

    return (
      <Stack
        key={item.id}
        direction={'row'}
        paddingLeft={2}
        spacing={1}
        style={{ width: '100%', alignItems: 'center' }}
      >
        <Input
          size={'md'}
          name={'amount'}
          value={item.amount}
          variant={'outline'}
          onChange={onChange}
          autoComplete={'off'}
          type={'number'}
          width={50}
        />
        <Menu closeOnSelect>
          <MenuButton
            as={Button}
            style={{ marginRight: 4 }}
            size={'md'}
            _focus={{ boxShadow: 'none' }}
          >
            {item.timeUnit}
          </MenuButton>
          <MenuList>
            <Stack spacing={1}>
              <MenuItem
                onClick={() => {
                  handleChange('timeUnit', 'minutes');
                }}
              >
                minutes
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleChange('timeUnit', 'hours');
                }}
              >
                hours
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleChange('timeUnit', 'days');
                }}
              >
                days
              </MenuItem>
            </Stack>
          </MenuList>
        </Menu>
        <Menu closeOnSelect>
          <MenuButton
            as={Button}
            style={{ marginRight: 4 }}
            size={'md'}
            _focus={{ boxShadow: 'none' }}
          >
            {item.type}
          </MenuButton>
          <MenuList>
            <Stack spacing={1}>
              <MenuItem
                onClick={() => {
                  handleChange('type', ALARM_TYPE.PUSH);
                }}
              >
                push
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleChange('type', ALARM_TYPE.EMAIL);
                }}
              >
                email
              </MenuItem>
            </Stack>
          </MenuList>
        </Menu>
        <Spacer />
        <IconButton
          _focus={{ boxShadow: 'none' }}
          variant={'ghost'}
          aria-label="Menu"
          background={'transparent'}
          icon={<TrashIcon className={'AttendeeIcon'} />}
          isRound
          size={'xs'}
          autoFocus={false}
          onClick={() => removeAlarm(item)}
        />
      </Stack>
    );
  });
};

interface AlarmsProps {
  selected?: any;
  alarms: any;
  addAlarm?: any;
  removeAlarm?: any;
  updateAlarm?: any;
  disabled?: boolean;
  hasEmailAccount?: any;
}
const Alarms = (props: AlarmsProps) => {
  const {
    selected,
    alarms,
    addAlarm,
    removeAlarm,
    updateAlarm,
    disabled,
    hasEmailAccount,
  } = props;

  const [modalOpen, openModal] = useState(false);

  const [store] = useContext(Context);

  const { isDark, isMobile } = store;
  //
  // const calendarSettings: GetCalendarSettingsResponse = useSelector(
  //   (state: any) => state.calendarSettings
  // );

  const calendarSettings: any = {};

  const noNewAlarms: boolean = alarms && alarms.length === ALARMS_MAX_LENGTH;

  const alarmSettingsDefault: any =
    calendarSettings.defaultAlarmType !== 'PUSH'
      ? alarmSettings.map((item: any) => {
          if (item.value === 'custom') {
            return item;
          }
          const itemDefault: any = item;

          itemDefault.value.alarmType = calendarSettings.defaultAlarmType;

          return itemDefault;
        })
      : alarmSettings;

  const handleAddAlarm = () => {
    addAlarm({
      amount: 10,
      timeUnit: 'minutes',
      type: ALARM_TYPE.PUSH,
    });
  };

  const renderedAlarms = renderAlarms(alarms, removeAlarm, updateAlarm);

  return (
    <Flex
      direction={'column'}
      style={{
        width: '90%',
      }}
    >
      <Stack direction={'row'} align={'center'}>
        <FormIcon isDark={isDark} allVisible>
          <EvaIcons.Bell className={'EventDetail-icon'} />
        </FormIcon>
        {addAlarm ? (
          <Button
            _focus={{ boxShadow: 'none' }}
            style={{ height: 40 }}
            width={'100%'}
            justifyContent={'flex-start'}
            onClick={handleAddAlarm}
          >
            <Text style={{ fontWeight: 'normal' }}>Add alarm</Text>
          </Button>
        ) : null}
      </Stack>
      {alarms.length ? (
        <Stack direction={'row'} align={'center'}>
          <FormIcon isDark={isDark} allVisible hidden>
            <EvaIcons.Bell className={'EventDetail-icon'} />
          </FormIcon>
          <Stack direction={'column'} spacing={1}>
            {renderedAlarms}
          </Stack>
        </Stack>
      ) : null}
    </Flex>
  );
};

export default Alarms;
