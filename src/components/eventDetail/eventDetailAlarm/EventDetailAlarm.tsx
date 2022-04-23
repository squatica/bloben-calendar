import './EventDetailAlarm.scss';

import React, { useContext } from 'react';

import { AppAlarm } from '../../../utils/common';
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
import { Context } from '../../../context/store';
import { EvaIcons } from '../../eva-icons';
import FormIcon from '../../formIcon/FormIcon';
import TrashIcon from '../../eva-icons/trash';

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
        <Spacer />
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
  const { alarms, addAlarm, removeAlarm, updateAlarm } = props;

  const [store] = useContext(Context);

  const { isDark } = store;
  //
  // const calendarSettings: GetCalendarSettingsResponse = useSelector(
  //   (state: any) => state.calendarSettings
  // );

  const handleAddAlarm = () => {
    addAlarm({
      amount: 10,
      timeUnit: 'minutes',
    });
  };

  const renderedAlarms = renderAlarms(alarms, removeAlarm, updateAlarm);

  return (
    <Flex
      direction={'column'}
      style={{
        width: '100%',
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
        <Stack
          direction={'row'}
          align={'center'}
          style={{ marginTop: 4, marginBottom: 4 }}
        >
          <FormIcon isDark={isDark} allVisible hidden>
            <EvaIcons.Bell className={'EventDetail-icon'} />
          </FormIcon>
          <Stack direction={'column'} spacing={2}>
            {renderedAlarms}
          </Stack>
        </Stack>
      ) : null}
    </Flex>
  );
};

export default Alarms;
