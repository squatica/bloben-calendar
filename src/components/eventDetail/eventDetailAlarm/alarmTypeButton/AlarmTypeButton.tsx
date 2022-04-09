import { ALARM_TYPE } from '../../../../bloben-interface/enums';
import { Alarm } from '../../../../bloben-interface/eventAlarm/eventAlarm';
import {
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stack,
  Text,
} from '@chakra-ui/react';
import { Context } from '../../../../context/store';
import { EvaIcons } from '../../../eva-icons';
import FormIcon from '../../../formIcon/FormIcon';
import React, { useContext } from 'react';

interface SelectedAlarmTypeProps {
  alarm: Alarm;
}
const SelectedAlarmType = (props: SelectedAlarmTypeProps) => {
  const { alarm } = props;

  const [store] = useContext(Context);

  const { isDark } = store;

  const isPushAlarm: boolean = alarm.alarmType === ALARM_TYPE.PUSH;

  return (
    <>
      <FormIcon allVisible isDark={isDark}>
        {isPushAlarm ? <EvaIcons.Email /> : <EvaIcons.Email />}
      </FormIcon>
      <Text>{alarm.alarmType}</Text>
    </>
  );
};

interface AlarmTypeButtonProps {
  alarm: Alarm;
  onClick: any;
}
const AlarmTypeButton = (props: AlarmTypeButtonProps) => {
  const { alarm, onClick } = props;

  const selectedValue: any = <SelectedAlarmType alarm={alarm} />;

  return (
    <Menu>
      <MenuButton as={Button} _focus={{ boxShadow: 'none' }}>
        {selectedValue}
      </MenuButton>
      <MenuList>
        <Stack spacing={1}>
          <MenuItem onClick={() => onClick(ALARM_TYPE.PUSH)}>
            <Text>{ALARM_TYPE.PUSH}</Text>
          </MenuItem>
          <MenuItem onClick={() => onClick(ALARM_TYPE.EMAIL)}>
            <Text>{ALARM_TYPE.EMAIL}</Text>
          </MenuItem>
        </Stack>
      </MenuList>
    </Menu>
  );
};

export default AlarmTypeButton;
