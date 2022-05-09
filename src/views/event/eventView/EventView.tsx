import './EventView.scss';

/* tslint:disable:no-magic-numbers */
import { useSelector } from 'react-redux';
import React, { useContext, useEffect, useState } from 'react';

import {
  CalDavCalendar,
  CalDavEvent,
  ReduxState,
} from '../../../types/interface';
import { createToast, formatEventDate } from '../../../utils/common';

import { Context } from 'context/store';
import { EVENT_TYPE, REPEATED_EVENT_CHANGE_TYPE } from 'bloben-interface/enums';
import { EvaIcons } from 'components/eva-icons';
import { Stack, Text, useToast } from '@chakra-ui/react';
import { TOAST_STATUS } from '../../../types/enums';
import { WebcalCalendar } from '../../../redux/reducers/webcalCalendars';
import { calendarByEvent } from '../../../utils/tsdavHelper';
import { debug } from '../../../utils/debug';
import { v4 } from 'uuid';
import CalDavEventsApi from '../../../api/CalDavEventsApi';
import EventDetailAttendee from '../../../components/eventDetail/eventDetailAttendee/EventDetailAttendee';
import EventDetailCalendar from '../../../components/eventDetail/eventDetailCalendar/EventDetailCalendar';
import EventDetailLocation from '../../../components/eventDetail/eventDetailLocation/EventDetailLocation';
import EventDetailNotes from '../../../components/eventDetail/eventDetailNotes/EventDetailNotes';
import EventDetailTitle from '../../../components/eventDetail/eventDetailTitle/EventDetailTitle';
import FormIcon from '../../../components/formIcon/FormIcon';
import HeaderModal from '../../../components/headerModal/HeaderModal';
import ICalHelper from '../../../utils/ICalHelper';
import Modal from 'components/modal/Modal';
import RepeatEventModal, {
  REPEAT_MODAL_TYPE,
} from '../../../components/repeatEventModal/RepeatEventModal';

export const checkIfHasRepeatPreAction = (event: any) => {
  return (
    event?.rRule?.length > 1 ||
    event?.recurrenceID ||
    event?.recurrenceID?.value
  );
};

interface EventDatesProps {
  event: CalDavEvent;
  isSmall?: boolean;
}
const EventDates = (props: EventDatesProps) => {
  const { event } = props;

  const [store] = useContext(Context);
  const { isDark } = store;

  const humanDate: any = formatEventDate(event);
  const { dates, time } = humanDate;

  return (
    <Stack direction={'row'} align={'center'}>
      <FormIcon desktopVisible isDark={isDark}>
        <EvaIcons.Clock className={'EventDetail-icon'} />
      </FormIcon>
      <Text>{dates}</Text>
      {event.allDay ? null : <Text>{time}</Text>}
    </Stack>
  );
};

interface EventViewProps {
  data: CalDavEvent;
  handleClose: any;
  openEditEventModal: any;
  currentE: any;
}

const EventView = (props: EventViewProps) => {
  const toast = useToast();

  const [store, dispatchContext] = useContext(Context);
  const setContext = (type: string, payload: any) => {
    dispatchContext({ type, payload });
  };

  const { handleClose, openEditEventModal, currentE } = props;

  const { isDark, isMobile } = store;

  // const [isOrganizer, setIsOrganizer] = useState(false);
  const [event, setEvent] = useState(null as any);
  const [calendar, setCalendar] = useState(null as any);
  const [deleteModalOpen, openDeleteModal] = useState(false);

  const calendars: CalDavCalendar[] = useSelector(
    (state: ReduxState) => state.calDavCalendars
  );
  const webcalCalendars: WebcalCalendar[] = useSelector(
    (state: ReduxState) => state.webcalCalendars
  );

  const getCalendar = async () => {
    const thisCalendar: any = calendarByEvent(props.data, calendars);
    if (thisCalendar) {
      setCalendar(thisCalendar);
    } else {
      const webcalCalendar: any = calendarByEvent(props.data, webcalCalendars);
      if (webcalCalendar) {
        setCalendar({ ...webcalCalendar, displayName: webcalCalendar.name });
      }
    }
  };

  const loadEvent = async (): Promise<void> => {
    setEvent(props.data);
  };

  const handleEdit = () => {
    openEditEventModal(event);
    handleClose();
  };

  const deleteEvent = async () => {
    if (checkIfHasRepeatPreAction(event) && !deleteModalOpen) {
      openDeleteModal(true);
      return;
    }

    try {
      const response = await CalDavEventsApi.deleteEvent({
        calendarID: calendar.id,
        url: event.url,
        etag: event.etag,
        id: event.id,
      });
      if (response.status === 200 || response.status === 204) {
        setContext('syncSequence', store.syncSequence + 1);

        toast(createToast('Event deleted'));

        handleClose();
      }
    } catch (e: any) {
      toast(createToast(e.response?.data?.message, TOAST_STATUS.ERROR));
    }
  };

  const handleDeleteRepeated = async (value: REPEATED_EVENT_CHANGE_TYPE) => {
    try {
      // use issued id or create for new event
      const newEventExternalID: string = event?.externalID || v4();

      let iCalString: string | null;

      let response;

      if (value === REPEATED_EVENT_CHANGE_TYPE.SINGLE) {
        if (event.recurrenceID || event.recurrenceID?.value) {
          response = await CalDavEventsApi.deleteRepeatedEvent({
            calendarID: calendar.id,
            url: event.url,
            etag: event.etag,
            id: event.id,
            type: REPEATED_EVENT_CHANGE_TYPE.SINGLE_RECURRENCE_ID,
            recurrenceID: event.recurrenceID,
          });
          if (response.status === 200 || response.status === 204) {
            setContext('syncSequence', store.syncSequence + 1);

            toast(createToast('Event deleted'));

            handleClose();
          }

          return;
        } else {
          const originalEvent = await CalDavEventsApi.getEvent(
            calendar.id,
            event.url
          );
          iCalString = new ICalHelper({
            ...event,
            startAt: originalEvent.data.startAt,
            endAt: originalEvent.data.endAt,
            timezoneStart: originalEvent.data.timezoneStart,
            externalID: newEventExternalID,
            rRule: originalEvent.data.rRule,
            recurrenceID: undefined,
            exdates: [
              ...event.exdates,
              { value: event.startAt, timezone: event.timezoneStartAt },
            ],
          }).parseTo();

          debug(iCalString);

          response = await CalDavEventsApi.deleteRepeatedEvent({
            calendarID: calendar.id,
            url: event.url,
            etag: event.etag,
            id: event.id,
            type: value,
            // @ts-ignore
            iCalString: iCalString ? iCalString : null,
            exDates: [
              ...event.exdates,
              { value: event.startAt, timezone: event.timezoneStartAt },
            ],
          });
        }
      } else if (value === REPEATED_EVENT_CHANGE_TYPE.ALL) {
        response = await CalDavEventsApi.deleteRepeatedEvent({
          calendarID: calendar.id,
          url: event.url,
          etag: event.etag,
          id: event.id,
          type: value,
        });
      }

      if (response?.status === 200 || response?.status === 204) {
        setContext('syncSequence', store.syncSequence + 1);

        toast(createToast('Event deleted'));

        handleClose();
      }
    } catch (e: any) {
      toast(createToast(e.response?.data?.message, TOAST_STATUS.ERROR));
    }
  };

  useEffect(() => {
    loadEvent();
    getCalendar();
  }, [store.webcalEvents]);
  useEffect(() => {
    loadEvent();
    getCalendar();
  }, [JSON.stringify(props.data)]);

  return checkIfHasRepeatPreAction(event) && deleteModalOpen ? (
    <RepeatEventModal
      type={REPEAT_MODAL_TYPE.DELETE}
      handleClose={handleClose}
      title={''}
      handleClick={handleDeleteRepeated}
    />
  ) : event && event.id ? (
    <Modal e={currentE} handleClose={handleClose} maxHeight={'42%'}>
      <>
        {event.type === EVENT_TYPE.CALDAV ? (
          <HeaderModal
            isMobile={isMobile}
            isDark={isDark}
            hasHeaderShadow={false}
            onClose={handleClose}
            goBack={handleClose}
            handleEdit={event.type === EVENT_TYPE.CALDAV ? handleEdit : null}
            handleDelete={event.type === EVENT_TYPE.CALDAV ? deleteEvent : null}
          />
        ) : null}
        <EventDetailTitle
          isNewEvent={false}
          value={event.summary}
          disabled={true}
        />
        <EventDates event={event} isSmall={false} />
        {calendar && calendar?.displayName ? (
          <EventDetailCalendar calendar={calendar} disabled />
        ) : null}
        {event.props?.attendee?.length ? (
          <EventDetailAttendee attendees={event.props.attendee} disabled />
        ) : null}

        {event.location?.length > 0 ? (
          <EventDetailLocation value={event.location} disabled />
        ) : null}
        {event.description?.length > 0 ? (
          <EventDetailNotes value={event.description} disabled />
        ) : null}
      </>
    </Modal>
  ) : null;
};

export default EventView;
