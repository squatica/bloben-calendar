import { DateTime } from 'luxon';
import { useSelector } from 'react-redux';
import React, { useContext, useEffect, useReducer, useState } from 'react';

import {
  AddAlarmData,
  AppAlarm,
  addAlarm,
  createToast,
  getLocalTimezone,
  removeAlarm,
  updateAlarm,
} from 'utils/common';

import { stateReducer } from 'utils/reducer/baseReducer';
import EventDetail from '../eventDetail/EventDetail';

import { Attendee } from '../../../utils/AttendeeUtils';
import {
  CalDavCalendar,
  CalDavEvent,
  ReduxState,
  User,
} from '../../../types/interface';
import { Context } from 'context/store';
import { DatetimeParser, parseToDateTime } from 'utils/datetimeParser';
import { Flex, Spacer, useToast } from '@chakra-ui/react';
import { TOAST_STATUS } from '../../../types/enums';

import { CalendarSettingsResponse } from '../../../bloben-interface/calendarSettings/calendarSettings';
import { initialFormState, initialState } from './EditEvent.utils';
import { reduxStore } from '../../../layers/ReduxProvider';
import { v4 } from 'uuid';
import CalDavEventsApi from '../../../api/CalDavEventsApi';
import ICalHelper from '../../../utils/ICalHelper';

import { debug } from '../../../utils/debug';
import { map } from 'lodash';
import { parseIcalAlarmToAppAlarm } from '../../../utils/caldavAlarmHelper';
import ChakraModal from '../../../components/chakraCustom/ChakraModal';
import LuxonHelper from '../../../utils/LuxonHelper';
import PrimaryButton from '../../../components/chakraCustom/primaryButton/PrimaryButton';
import Separator from 'components/separator/Separator';

export const findItemCalendar = (item: any) => {
  const state = reduxStore.getState();
  const itemCalendar: CalDavCalendar = state.calDavCalendars.filter(
    (calendarItem: CalDavCalendar) => calendarItem.id === item?.calendarID
  )[0];

  if (!itemCalendar) {
    throw Error('No calendar found');
  }

  return itemCalendar;
};

export const createEvent = async (
  form: any,
  isNewEvent: boolean,
  calendar?: CalDavCalendar,
  handleClose?: any,
  originalEvent?: any
) => {
  const eventCalendar: CalDavCalendar =
    calendar || findItemCalendar(originalEvent);

  const calendarChanged: boolean =
    !isNewEvent && originalEvent?.calendarID !== eventCalendar.id;

  // use issued id or create for new event
  const newEventExternalID: string = originalEvent?.externalID || v4();

  const iCalString: string = new ICalHelper({
    ...form,
    externalID: newEventExternalID,
  }).parseTo();

  debug(iCalString);

  if (isNewEvent) {
    await CalDavEventsApi.createEvent({
      calendarID: eventCalendar.id,
      iCalString,
      externalID: newEventExternalID,
    });
  } else {
    if (calendarChanged) {
      await CalDavEventsApi.updateEvent({
        calendarID: eventCalendar.id,
        iCalString,
        externalID: newEventExternalID,
        id: originalEvent.id,
        url: originalEvent.url,
        etag: originalEvent.etag,
        prevEvent: {
          externalID: originalEvent.externalID,
          id: originalEvent.id,
          url: originalEvent.url,
          etag: originalEvent.etag,
        },
      });
    } else {
      await CalDavEventsApi.updateEvent({
        calendarID: eventCalendar.id,
        iCalString,
        id: originalEvent.id,
        externalID: originalEvent.externalID,
        url: originalEvent.url,
        etag: originalEvent.etag,
        prevEvent: null,
      });
    }
  }

  // Close modal
  if (handleClose) {
    handleClose();
  }
};

interface EditEventProps {
  handleClose: any;
  isNewEvent: boolean;
  newEventTime?: any;
  defaultReminder?: any; // Remove?
  event?: CalDavEvent;
  wasInitRef?: any;
  currentE: any;
}

export const RRULE_DATE_FORMAT = 'yyyyLLddHHmmss';

const isEventKnownProp = (prop: string) => {
  const knownProps = [
    'startAt',
    'endAt',
    'summary',
    'timezoneStartAt',
    'timezoneEndAt',
    'location',
    'allDay',
    'description',
    'rRule',
    'props',
    'color',
    'alarms',
  ];

  return knownProps.includes(prop);
};

export const parseRRuleDate = (date: string) => {
  const datetime: string = DateTime.fromISO(date).toFormat(RRULE_DATE_FORMAT);

  return (
    datetime.slice(0, 'YYYYMMDD'.length) +
    'T' +
    datetime.slice('YYYYMMDD'.length) +
    'Z'
  );
};

const EditEvent = (props: EditEventProps) => {
  const toast = useToast();

  // Redux state
  const calDavCalendars: CalDavCalendar[] = useSelector(
    (state: ReduxState) => state.calDavCalendars
  );
  const user: User = useSelector((state: ReduxState) => state.user);
  const settings: CalendarSettingsResponse = useSelector(
    (state: ReduxState) => state.calendarSettings
  );

  const [eventState] = useReducer(stateReducer, initialState);

  const [form, dispatchForm] = useReducer(stateReducer, initialFormState);
  const [calendar, setCalendar] = useState(null as any);

  const [store, dispatchContext] = useContext(Context);
  const setContext = (type: string, payload: any) => {
    dispatchContext({ type, payload });
  };

  const setForm = (type: any, payload: any) => {
    if (type === 'rRule') {
      const needSlice = payload.includes('RRULE');

      let customPayload = payload;

      if (needSlice) {
        customPayload = payload.slice(6);
      }

      const data = {
        type,
        payload: customPayload,
      };

      // @ts-ignore
      dispatchForm(data);

      return;
    }
    // @ts-ignore
    dispatchForm({ type, payload });
  };

  const { isNewEvent, newEventTime, handleClose, event } = props;

  const { isStartDateValid } = eventState;

  const {
    summary,
    location,
    description,
    calendarID,
    allDay,
    startAt,
    endAt,
    isRepeated,
    alarms,
    timezoneStartAt,
    attendees,
    organizer,
    rRule,
    color,
  } = form;

  const loadEvent = async () => {
    // Find event
    const eventItem: any = event;

    if (eventItem) {
      // Set state
      // Set previous event state to check for occurrences
      setForm('prevItem', eventItem);

      // Set event data
      for (const [key, value] of Object.entries(eventItem)) {
        if (isEventKnownProp(key)) {
          if (value) {
            setForm(key, value);
          }

          if (key === 'props') {
            // @ts-ignore
            if (value.attendee) {
              // @ts-ignore
              setForm('attendees', value.attendee);
            } else {
              // @ts-ignore
              if (value.alarms && value.alarms.length) {
                // @ts-ignore
                setForm('alarms', map(value.alarms, parseIcalAlarmToAppAlarm));
              }
            }
          }
        }
      }
    }
  };

  /**
   * Find calendar by calendarID
   * Set color event and default alarms for this calendar if event has none
   */
  const loadCalendar = async (calendarID: string | undefined) => {
    let thisCalendar: CalDavCalendar | undefined;

    if (props.event || calendarID) {
      thisCalendar = calDavCalendars.find(
        (item) =>
          item.id === (calendarID ? calendarID : props.event?.calendarID)
      );
    } else {
      const defaultCalendarID = settings.defaultCalendarID;
      thisCalendar = defaultCalendarID
        ? calDavCalendars.find((item) => item.id === defaultCalendarID)
        : undefined;
    }

    if (!thisCalendar) {
      return;
    }
    if (isNewEvent) {
      const timezoneFromCalendar: string = getLocalTimezone();

      setForm('timezoneStartAt', timezoneFromCalendar);
      setForm('timezoneEndAt', timezoneFromCalendar);
    }
    setCalendar(thisCalendar);
  };

  /**
   * Set date time for new event
   */
  const initNewEventOnMount = async (): Promise<void> => {
    const defaultCalendarID = settings.defaultCalendarID;
    const defaultCalendar = defaultCalendarID
      ? calDavCalendars.find((item) => item.id === defaultCalendarID)
      : null;
    setForm(
      'calendarUrl',
      defaultCalendar ? defaultCalendar.url : calDavCalendars[0].url
    );
    // setDefaultReminder(defaultReminder, setForm);

    const thisCalendar: CalDavCalendar | undefined = defaultCalendar
      ? defaultCalendar
      : calDavCalendars[0];

    if (!thisCalendar) {
      return;
    }
    const timezoneFromCalendar: string = getLocalTimezone();

    setForm('timezoneStartAt', timezoneFromCalendar);
    setForm('timezoneEndAt', timezoneFromCalendar);
    setCalendar(thisCalendar);

    if (thisCalendar.alarms) {
      setForm(
        'alarms',
        map(thisCalendar.alarms, (alarm) => ({
          id: v4(),
          isBefore: true,
          ...alarm,
        }))
      );
    }

    if (
      (store?.emailConfig?.hasSystemConfig ||
        store?.emailConfig?.hasCustomConfig) &&
      store.emailConfig?.mailto
    ) {
      setForm('organizer', {
        CN: user.username,
        mailto: store.emailConfig?.mailto,
      });
    }

    if (!newEventTime) {
      return;
    }

    if (newEventTime.view === 'month') {
      setForm('allDay', true);
    }

    setForm('startAt', newEventTime.startAt);
    setForm('endAt', newEventTime.endAt);
  };

  useEffect(() => {
    if (isNewEvent) {
      initNewEventOnMount();
    } else {
      loadEvent();
    }
  }, [isNewEvent]);

  useEffect(() => {
    loadCalendar(calendarID);
  }, [calendarID]);

  const addAlarmEvent = (item: AddAlarmData) => {
    addAlarm(item, setForm, alarms);
  };

  const removeAlarmEvent = (item: AppAlarm) => {
    removeAlarm(item, setForm, alarms);
  };
  const updateAlarmEvent = (item: AppAlarm) => {
    updateAlarm(item, setForm, alarms);
  };

  /**
   * Attendees
   * @param item
   */
  const addAttendee = (item: Attendee) => {
    setForm('attendees', [...attendees, item]);
  };
  const removeAttendee = (item: Attendee) => {
    const attendeeFiltered: any = [...attendees].filter(
      (attendee: any) => attendee.mailto !== item.mailto
    );
    setForm('attendees', attendeeFiltered);
  };

  const updateAttendee = (item: Attendee) => {
    const updatedAttendees = attendees.map((attendee: Attendee) => {
      if (item.mailto === attendee.mailto) {
        return item;
      } else {
        return attendee;
      }
    });

    setForm('attendees', updatedAttendees);
  };

  const setStartTimezone = (value: string) => {
    setForm('timezoneStartAt', value);
    setForm('timezoneEndAt', value);
  };

  /**
   * Validate event interval
   * @param changedDate
   * @param startAtDate
   * @param endAtDate
   */
  const validateDate = (
    changedDate: string,
    startAtDate: any,
    endAtDate: any
  ): boolean => {
    if (LuxonHelper.isSameDay(endAtDate, startAtDate) && allDay) {
      return true;
    }

    if (LuxonHelper.isBeforeAny(endAtDate, startAtDate)) {
      return false;
    }

    return true;
  };
  /**
   * Validate startAt date before change
   * @param dateValue
   */
  const handleChangeDateFrom = (dateValue: DateTime | string) => {
    setForm('startAt', DatetimeParser(dateValue, timezoneStartAt));

    const isDateValid: boolean = validateDate('startAt', dateValue, endAt);

    if (!isDateValid) {
      setForm(
        'endAt',
        DatetimeParser(
          parseToDateTime(dateValue, timezoneStartAt).plus({ hour: 1 }),
          timezoneStartAt
        )
      );
    }
  };
  /**
   * Validate endAt date before change
   * @param dateValue
   */
  const handleChangeDateTill = (dateValue: any) => {
    const isDateValid: boolean = validateDate('endAt', startAt, dateValue);

    if (isDateValid) {
      setForm('endAt', DatetimeParser(dateValue, timezoneStartAt));
    } else {
      toast(createToast('Invalid date', TOAST_STATUS.ERROR));
    }
  };

  const handleChange = (event: any) => {
    const target = event.target;
    const name = target.name;
    const value: any = event.target.value;

    if (name === 'timezoneStartAt' || name === 'timezoneEndAt') {
      setForm('startAt', DatetimeParser(startAt, value));
      setForm('endAt', DatetimeParser(endAt, value));
    }

    setForm(name, value);
  };

  const selectCalendar = (calendarObj: any) => {
    const localTimezone = getLocalTimezone();
    setForm(
      'startAt',
      DatetimeParser(startAt, calendarObj.timezone || localTimezone)
    );
    setForm(
      'endAt',
      DatetimeParser(endAt, calendarObj.timezone || localTimezone)
    );
    setForm('calendarUrl', calendarObj.url);
    setCalendar(calendarObj);
    setForm('color', null);
  };

  const saveEvent = async () => {
    try {
      await createEvent(form, isNewEvent, calendar, handleClose, props.event);

      setContext('syncSequence', store.syncSequence + 1);

      toast(createToast(isNewEvent ? 'Event created' : 'Event updated'));
    } catch (e: any) {
      toast(createToast(e.response?.data?.message, TOAST_STATUS.ERROR));
    }
  };

  return (
    <ChakraModal handleClose={handleClose} minWidth={350} maxWidth={500}>
      <>
        <Flex
          direction={'column'}
          style={{ overflowY: 'auto', overflowX: 'hidden' }}
        >
          <Flex direction={'column'} style={{ paddingRight: 8 }}>
            {calendar?.url && startAt && endAt ? (
              <EventDetail
                isNewEvent={isNewEvent}
                calendar={calendar}
                summary={summary}
                location={location}
                description={description}
                startDate={startAt}
                rRule={rRule}
                endDate={endAt}
                isRepeated={isRepeated}
                handleChange={handleChange}
                allDay={allDay}
                setForm={setForm}
                handleChangeDateFrom={handleChangeDateFrom}
                handleChangeDateTill={handleChangeDateTill}
                isStartDateValid={isStartDateValid}
                alarms={alarms}
                addAlarm={addAlarmEvent}
                removeAlarm={removeAlarmEvent}
                updateAlarm={updateAlarmEvent}
                timezoneStartAt={timezoneStartAt}
                setStartTimezone={setStartTimezone}
                selectCalendar={selectCalendar}
                attendees={attendees}
                addAttendee={addAttendee}
                removeAttendee={removeAttendee}
                updateAttendee={updateAttendee}
                color={color || calendar.color}
                // makeOptional={makeOptional}
                organizer={organizer}
                form={form}
              />
            ) : (
              <div />
            )}
          </Flex>
        </Flex>
        <Separator height={16} />
        <Flex direction={'row'} style={{ marginRight: 16, marginTop: 2 }}>
          <Spacer />
          <PrimaryButton onClick={saveEvent}>Save</PrimaryButton>
        </Flex>
      </>
    </ChakraModal>
  );
};

export default EditEvent;
