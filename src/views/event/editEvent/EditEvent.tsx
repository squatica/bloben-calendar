import { DateTime } from 'luxon';
import { useSelector } from 'react-redux';
import React, { useContext, useEffect, useReducer, useState } from 'react';

import {
  AddAlarmData,
  AppAlarm,
  addAlarm,
  createToast,
  formatAppAlarm,
  getLocalTimezone,
  parseCalendarTimezone,
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
import {
  createEvent,
  initialFormState,
  initialState,
  updateRepeatedEvent,
} from './EditEvent.utils';
import { reduxStore } from '../../../layers/ReduxProvider';
import { v4 } from 'uuid';

import { REPEATED_EVENT_CHANGE_TYPE } from '../../../bloben-interface/enums';
import { checkIfHasRepeatPreAction } from '../eventView/EventView';
import { map } from 'lodash';
import { parseIcalAlarmToAppAlarm } from '../../../utils/caldavAlarmHelper';
import LuxonHelper from '../../../utils/LuxonHelper';
import ModalNew from '../../../components/modalNew/ModalNew';
import PrimaryButton from '../../../components/chakraCustom/primaryButton/PrimaryButton';
import RepeatEventModal, {
  REPEAT_MODAL_TYPE,
} from '../../../components/repeatEventModal/RepeatEventModal';
import SendInviteModal from '../../../components/sendInviteModalModal/SendInviteModal';
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

interface EditEventProps {
  handleClose: any;
  isNewEvent: boolean;
  newEventTime?: any;
  defaultReminder?: any; // Remove?
  event?: CalDavEvent;
  wasInitRef?: any;
  currentE: any;
  isDuplicatingEvent?: boolean;
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
    'valarms',
    'attendees',
    'exdates',
    'recurrenceID',
    'organizer',
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
  const [isSaving, setIsSaving] = useState(false);
  const [repeatChangeValue, setRepeatChangeValue] = useState<any>(null);
  const [wasSimpleEvent, setWasSimpleEvent] = useState(true);
  const [emailInviteModalVisible, openEmailInviteModal] = useState<any>(null);

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

  const { isNewEvent, newEventTime, handleClose, event, isDuplicatingEvent } =
    props;

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

  const showRepeatEventModal =
    checkIfHasRepeatPreAction(form) &&
    !repeatChangeValue &&
    !isNewEvent &&
    !wasSimpleEvent;

  const showEmailInviteModal =
    form?.attendees?.length &&
    (store?.emailConfig?.hasSystemConfig ||
      store?.emailConfig?.hasCustomConfig);

  const loadEvent = async () => {
    // Find event
    const eventItem: any = event;

    if (eventItem) {
      // Set state
      // Set previous event state to check for occurrences
      setForm('prevItem', eventItem);

      const wasRepeated = checkIfHasRepeatPreAction(eventItem);
      if (wasRepeated) {
        setWasSimpleEvent(false);
      } else {
        setWasSimpleEvent(true);
      }

      // Set event data
      for (const [key, value] of Object.entries(eventItem)) {
        if (isEventKnownProp(key)) {
          // @ts-ignore
          if (key === 'valarms' && value.length) {
            // @ts-ignore
            setForm('alarms', map(value, parseIcalAlarmToAppAlarm));
          } else if (value) {
            if (typeof value === 'string') {
              setForm(key, value.replaceAll('\\n', '\n'));
            } else {
              setForm(key, value);
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
      const timezoneFromCalendar: string = parseCalendarTimezone(
        thisCalendar.timezone
      );

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
      const originalDateTill = parseToDateTime(endAt, timezoneStartAt);
      setForm(
        'endAt',
        DatetimeParser(
          parseToDateTime(dateValue, timezoneStartAt).set({
            hour: originalDateTill.hour,
            minute: originalDateTill.minute,
          }),
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
    const localTimezone = parseCalendarTimezone(calendarObj.timezone);

    setForm('startAt', DatetimeParser(startAt, localTimezone));
    setForm('endAt', DatetimeParser(endAt, localTimezone));
    setForm('calendarUrl', calendarObj.url);
    setCalendar(calendarObj);
    setForm('alarms', calendarObj?.alarms || []);
    setForm('color', null);
  };

  const saveEvent = async () => {
    try {
      if (showEmailInviteModal) {
        openEmailInviteModal({
          call: async (sendInvite?: boolean, inviteMessage?: string) => {
            await createEvent(
              form,
              isNewEvent,
              calendar,
              handleClose,
              props.event,
              sendInvite,
              inviteMessage,
              isDuplicatingEvent
            );
            setContext('syncSequence', store.syncSequence + 1);
          },
        });

        return;
      }

      if (
        !isNewEvent &&
        !isDuplicatingEvent &&
        checkIfHasRepeatPreAction(form) &&
        !wasSimpleEvent
      ) {
        setIsSaving(true);
        await handleUpdateRepeatedEvent();

        setContext('syncSequence', store.syncSequence + 1);

        setIsSaving(false);

        toast(createToast('Event updated'));
        return;
      }

      setIsSaving(true);

      await createEvent(
        form,
        isNewEvent,
        calendar,
        handleClose,
        props.event,
        undefined,
        undefined,
        isDuplicatingEvent
      );

      setContext('syncSequence', store.syncSequence + 1);

      setIsSaving(false);

      toast(
        createToast(
          isNewEvent || isDuplicatingEvent ? 'Event created' : 'Event updated'
        )
      );
    } catch (e: any) {
      toast(createToast(e.response?.data?.message, TOAST_STATUS.ERROR));
      setIsSaving(false);
    }
  };

  const handleUpdateRepeatedEvent = async () => {
    const eventForm = form;

    if (eventForm.alarms?.length) {
      eventForm.alarms = map(alarms, formatAppAlarm);
    }
    // @ts-ignore
    eventForm.externalID = props.event?.externalID;

    if (showEmailInviteModal) {
      openEmailInviteModal({
        call: async (sendInvite?: boolean, inviteMessage?: string) => {
          await updateRepeatedEvent(
            eventForm,
            repeatChangeValue,
            calendar,
            undefined,
            props.event,
            sendInvite,
            inviteMessage
          );
        },
      });
    } else {
      await updateRepeatedEvent(
        eventForm,
        repeatChangeValue,
        calendar,
        undefined,
        props.event
      );
    }

    setRepeatChangeValue(null);
  };

  return (
    <>
      {showRepeatEventModal ? (
        <RepeatEventModal
          type={REPEAT_MODAL_TYPE.UPDATE}
          handleClose={handleClose}
          title={''}
          handleClick={(value: REPEATED_EVENT_CHANGE_TYPE) =>
            setRepeatChangeValue(value)
          }
        />
      ) : null}
      {emailInviteModalVisible ? (
        <SendInviteModal
          handleClose={handleClose}
          clickData={emailInviteModalVisible}
        />
      ) : null}
      {!showRepeatEventModal && !emailInviteModalVisible ? (
        <ModalNew
          handleClose={handleClose}
          className={'EditEventModal'}
          preventCloseOnBackdrop={true}
          closeButton={true}
          footer={
            <Flex direction={'row'} style={{ marginTop: 2 }}>
              <Spacer />
              <PrimaryButton isSecondary onClick={handleClose}>
                Cancel
              </PrimaryButton>
              <Separator width={6} />
              <PrimaryButton
                onClick={saveEvent}
                disabled={isSaving}
                isLoading={isSaving}
              >
                Save
              </PrimaryButton>
            </Flex>
          }
        >
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
                    repeatChangeValue={repeatChangeValue}
                    isRepeated={isRepeated}
                    handleChange={handleChange}
                    disabledRRule={
                      !wasSimpleEvent &&
                      repeatChangeValue !== REPEATED_EVENT_CHANGE_TYPE.ALL
                    }
                    disabledAttendeeChange={
                      !wasSimpleEvent &&
                      repeatChangeValue !== REPEATED_EVENT_CHANGE_TYPE.ALL
                    }
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
          </>
        </ModalNew>
      ) : null}
    </>
  );
};

export default EditEvent;
