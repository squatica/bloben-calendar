import { AppSettings, ReduxState } from '../../../types/interface';
import {
  Box,
  Button,
  Checkbox,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Stack,
} from '@chakra-ui/react';
import { CalendarView } from 'kalend';
import { updateSettings } from '../../../redux/actions';
import { useDispatch, useSelector } from 'react-redux';
import React from 'react';
import SettingsCard from '../settingsCard/SettingsCard';
// import { CALENDAR_VIEW } from 'kalend/dist/common/enums';

const CalendarSettings = () => {
  const dispatch = useDispatch();
  const settings: AppSettings = useSelector(
    (state: ReduxState) => state.settings
  );

  const handleUpdate = (key: string, value: any) => {
    dispatch(updateSettings(key, value));
  };

  const checkDisabledViewBox = (value: any) => {
    let disabledViews = [...settings.disabledViews];

    if (disabledViews.includes(value)) {
      disabledViews = disabledViews.filter((item) => item !== value);
    } else {
      disabledViews.push(value);
    }

    dispatch(updateSettings('disabledViews', disabledViews));
  };

  return (
    <>
      <SettingsCard title={'Time format'}>
        <Menu>
          <MenuButton as={Button} _focus={{ boxShadow: 'none' }}>
            {settings.timeFormat}
          </MenuButton>
          <MenuList>
            <MenuItem
              minH="40px"
              onClick={() => handleUpdate('timeFormat', '24')}
            >
              <span>24</span>
            </MenuItem>
            <MenuItem
              minH="40px"
              onClick={() => handleUpdate('timeFormat', '12')}
            >
              <span>12</span>
            </MenuItem>
          </MenuList>
        </Menu>
      </SettingsCard>
      <SettingsCard title={'Start of week'}>
        <Menu>
          <MenuButton as={Button} _focus={{ boxShadow: 'none' }}>
            {settings.startOfWeek}
          </MenuButton>
          <MenuList>
            <MenuItem
              minH="40px"
              onClick={() => handleUpdate('startOfWeek', 'Monday')}
            >
              <span>Monday</span>
            </MenuItem>
            <MenuItem
              minH="40px"
              onClick={() => handleUpdate('startOfWeek', 'Sunday')}
            >
              <span>Sunday</span>
            </MenuItem>
          </MenuList>
        </Menu>
      </SettingsCard>
      <SettingsCard title={'Default view'}>
        <Menu>
          <MenuButton as={Button} _focus={{ boxShadow: 'none' }}>
            {settings.defaultView}
          </MenuButton>
          <MenuList>
            <MenuItem
              minH="40px"
              onClick={() => handleUpdate('defaultView', CalendarView.AGENDA)}
            >
              <span>Agenda</span>
            </MenuItem>
            <MenuItem
              minH="40px"
              onClick={() => handleUpdate('defaultView', CalendarView.DAY)}
            >
              <span>Day</span>
            </MenuItem>
            <MenuItem
              minH="40px"
              onClick={() =>
                handleUpdate('defaultView', CalendarView.THREE_DAYS)
              }
            >
              <span>3 days</span>
            </MenuItem>
            <MenuItem
              minH="40px"
              onClick={() => handleUpdate('defaultView', CalendarView.WEEK)}
            >
              <span>Week</span>
            </MenuItem>
            <MenuItem
              minH="40px"
              onClick={() => handleUpdate('defaultView', CalendarView.MONTH)}
            >
              <span>Month</span>
            </MenuItem>
          </MenuList>
        </Menu>
      </SettingsCard>
      <SettingsCard title={'Hour height'}>
        <NumberInput
          defaultValue={settings.hourHeight}
          max={80}
          min={20}
          step={5}
          width={40}
          keepWithinRange={true}
          clampValueOnBlur={false}
          onChange={(valueAsString: string, valueAsNumber: number) => {
            handleUpdate('hourHeight', valueAsNumber);
          }}
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </SettingsCard>
      <SettingsCard title={'Enabled views'}>
        <Stack spacing={5} direction="row">
          <Box onClick={() => checkDisabledViewBox(CalendarView.AGENDA)}>
            <Checkbox
              colorScheme="teal"
              value={CalendarView.AGENDA}
              isChecked={!settings.disabledViews.includes(CalendarView.AGENDA)}
            >
              Agenda
            </Checkbox>
          </Box>
          <Box onClick={() => checkDisabledViewBox(CalendarView.DAY)}>
            <Checkbox
              colorScheme="teal"
              value={CalendarView.DAY}
              isChecked={!settings.disabledViews.includes(CalendarView.DAY)}
            >
              Day
            </Checkbox>
          </Box>
          <Box onClick={() => checkDisabledViewBox(CalendarView.THREE_DAYS)}>
            <Checkbox
              colorScheme="teal"
              value={CalendarView.DAY}
              isChecked={
                !settings.disabledViews.includes(CalendarView.THREE_DAYS)
              }
            >
              3 Days
            </Checkbox>
          </Box>
          <Box onClick={() => checkDisabledViewBox(CalendarView.WEEK)}>
            <Checkbox
              colorScheme="teal"
              value={CalendarView.DAY}
              isChecked={!settings.disabledViews.includes(CalendarView.WEEK)}
            >
              Week
            </Checkbox>
          </Box>
          <Box onClick={() => checkDisabledViewBox(CalendarView.MONTH)}>
            <Checkbox
              colorScheme="teal"
              value={CalendarView.DAY}
              isChecked={!settings.disabledViews.includes(CalendarView.MONTH)}
            >
              Month
            </Checkbox>
          </Box>
        </Stack>
      </SettingsCard>
    </>
  );
};

export default CalendarSettings;
