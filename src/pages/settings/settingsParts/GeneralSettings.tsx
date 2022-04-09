import {
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
} from '@chakra-ui/react';
import {
  CalendarSettingsResponse,
  PatchCalendarSettingsRequest,
} from '../../../bloben-interface/calendarSettings/calendarSettings';
import { CalendarView } from 'kalend';
import { ReduxState } from '../../../types/interface';
import { setCalendarSettings, setSettings } from '../../../redux/actions';
import { useDispatch, useSelector } from 'react-redux';
import CalendarSettingsApi from '../../../api/CalendarSettingsApi';
import ChakraTimezoneSelect from '../../../components/chakraCustom/ChakraTimezoneSelect';
import React from 'react';
import SettingsRow from '../settingsRow/SettingsRow';

const menuStyle: any = {
  width: '100%',
  justifyContent: 'flex-start',
  textAlign: 'left',
};

const GeneralSettings = () => {
  const dispatch = useDispatch();
  const settings: CalendarSettingsResponse = useSelector(
    (state: ReduxState) => state.calendarSettings
  );

  const requestUpdate = async (data: PatchCalendarSettingsRequest) => {
    await CalendarSettingsApi.patch(data);

    const response = await CalendarSettingsApi.get();

    dispatch(setCalendarSettings(response.data));
  };

  const handleUpdate = async (key: string, value: any) => {
    const newSettings: any = {};

    newSettings[key] = value;

    await requestUpdate(newSettings);
  };

  const handleTimezoneUpdate = async (item: any) => {
    const newSettings: any = {};

    newSettings.timezone = item.value;

    await requestUpdate(newSettings);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const checkDisabledViewBox = (value: any) => {
    const newSettings: any = { ...settings };

    let disabledViews: string[] = newSettings.disabledViews;

    if (disabledViews.includes(value)) {
      disabledViews = disabledViews.filter((item) => item !== value);
    } else {
      disabledViews.push(value);
    }

    newSettings['disabledViews'] = disabledViews;

    dispatch(setSettings(newSettings));
  };

  return (
    <>
      <SettingsRow title={'Time format'}>
        <Menu>
          <MenuButton
            as={Button}
            style={menuStyle}
            _focus={{ boxShadow: 'none' }}
          >
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
      </SettingsRow>
      <SettingsRow title={'Start of week'}>
        <Menu>
          <MenuButton
            as={Button}
            style={menuStyle}
            _focus={{ boxShadow: 'none' }}
          >
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
      </SettingsRow>
      <SettingsRow title={'Default view'}>
        <Menu>
          <MenuButton
            as={Button}
            style={menuStyle}
            _focus={{ boxShadow: 'none' }}
          >
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
      </SettingsRow>
      <SettingsRow title={'Hour height'}>
        <NumberInput
          style={menuStyle}
          defaultValue={settings.hourHeight}
          max={120}
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
      </SettingsRow>
      <SettingsRow title={'Timezone'}>
        <ChakraTimezoneSelect
          onSelect={handleTimezoneUpdate}
          value={settings.timezone}
        />
      </SettingsRow>
      {/*<SettingsRow title={'Enabled views'}>*/}
      {/*  <Menu closeOnSelect={false}>*/}
      {/*    <MenuButton*/}
      {/*      as={Button}*/}
      {/*      style={menuStyle}*/}
      {/*      _focus={{ boxShadow: 'none' }}*/}
      {/*    >*/}
      {/*      Select*/}
      {/*    </MenuButton>*/}
      {/*    <MenuList>*/}
      {/*      <Stack spacing={1}>*/}
      {/*        <MenuItem*/}
      {/*          onClick={() => checkDisabledViewBox(CalendarView.AGENDA)}*/}
      {/*        >*/}
      {/*          <Box>*/}
      {/*            <Checkbox*/}
      {/*              colorScheme="teal"*/}
      {/*              value={CalendarView.AGENDA}*/}
      {/*              isChecked={*/}
      {/*                !settings.disabledViews.includes(CalendarView.AGENDA)*/}
      {/*              }*/}
      {/*            >*/}
      {/*              Agenda*/}
      {/*            </Checkbox>*/}
      {/*          </Box>*/}
      {/*        </MenuItem>*/}
      {/*        <MenuItem onClick={() => checkDisabledViewBox(CalendarView.DAY)}>*/}
      {/*          <Box>*/}
      {/*            <Checkbox*/}
      {/*              colorScheme="teal"*/}
      {/*              value={CalendarView.DAY}*/}
      {/*              isChecked={*/}
      {/*                !settings.disabledViews.includes(CalendarView.DAY)*/}
      {/*              }*/}
      {/*            >*/}
      {/*              Day*/}
      {/*            </Checkbox>*/}
      {/*          </Box>*/}
      {/*        </MenuItem>*/}
      {/*        <MenuItem*/}
      {/*          onClick={() => checkDisabledViewBox(CalendarView.THREE_DAYS)}*/}
      {/*        >*/}
      {/*          <Box>*/}
      {/*            <Checkbox*/}
      {/*              colorScheme="teal"*/}
      {/*              value={CalendarView.DAY}*/}
      {/*              isChecked={*/}
      {/*                !settings.disabledViews.includes(CalendarView.THREE_DAYS)*/}
      {/*              }*/}
      {/*            >*/}
      {/*              3 Days*/}
      {/*            </Checkbox>*/}
      {/*          </Box>*/}
      {/*        </MenuItem>*/}
      {/*        <MenuItem onClick={() => checkDisabledViewBox(CalendarView.WEEK)}>*/}
      {/*          <Box>*/}
      {/*            <Checkbox*/}
      {/*              colorScheme="teal"*/}
      {/*              value={CalendarView.DAY}*/}
      {/*              isChecked={*/}
      {/*                !settings.disabledViews.includes(CalendarView.WEEK)*/}
      {/*              }*/}
      {/*            >*/}
      {/*              Week*/}
      {/*            </Checkbox>*/}
      {/*          </Box>*/}
      {/*        </MenuItem>*/}
      {/*        <MenuItem*/}
      {/*          onClick={() => checkDisabledViewBox(CalendarView.MONTH)}*/}
      {/*        >*/}
      {/*          <Box>*/}
      {/*            <Checkbox*/}
      {/*              colorScheme="teal"*/}
      {/*              value={CalendarView.DAY}*/}
      {/*              isChecked={*/}
      {/*                !settings.disabledViews.includes(CalendarView.MONTH)*/}
      {/*              }*/}
      {/*            >*/}
      {/*              Month*/}
      {/*            </Checkbox>*/}
      {/*          </Box>*/}
      {/*        </MenuItem>*/}
      {/*      </Stack>*/}
      {/*    </MenuList>*/}
      {/*  </Menu>*/}
      {/*</SettingsRow>*/}
    </>
  );
};

export default GeneralSettings;
