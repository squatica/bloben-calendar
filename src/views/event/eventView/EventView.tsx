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
import { EvaIcons } from 'components/eva-icons';
import { Stack, Text, useToast } from '@chakra-ui/react';
import { TOAST_STATUS } from '../../../types/enums';
import { calendarByEvent } from '../../../utils/tsdavHelper';
import CalDavEventsApi from '../../../api/CalDavEventsApi';
import ChakraModal from '../../../components/chakraCustom/ChakraModal';
import EventDetailCalendar from '../../../components/eventDetail/eventDetailCalendar/EventDetailCalendar';
import EventDetailLocation from '../../../components/eventDetail/eventDetailLocation/EventDetailLocation';
import EventDetailNotes from '../../../components/eventDetail/eventDetailNotes/EventDetailNotes';
import EventDetailTitle from '../../../components/eventDetail/eventDetailTitle/EventDetailTitle';
import FormIcon from '../../../components/formIcon/FormIcon';
import HeaderModal from '../../../components/headerModal/HeaderModal';

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
      <Text>{time}</Text>
    </Stack>
  );
};

interface EventViewProps {
  data: CalDavEvent;
  handleClose: any;
  openEditEventModal: any;
}

const EventView = (props: EventViewProps) => {
  const toast = useToast();

  const [store, dispatchContext] = useContext(Context);
  const setContext = (type: string, payload: any) => {
    dispatchContext({ type, payload });
  };

  const { handleClose, openEditEventModal } = props;

  const { isDark, isMobile } = store;

  // const [isOrganizer, setIsOrganizer] = useState(false);
  const [event, setEvent] = useState(null as any);
  const [calendar, setCalendar] = useState(null as any);

  const calendars: CalDavCalendar[] = useSelector(
    (state: ReduxState) => state.calDavCalendars
  );

  const getCalendar = async () => {
    const thisCalendar: any = await calendarByEvent(props.data, calendars);
    setCalendar(thisCalendar);
  };

  const loadEvent = async (): Promise<void> => {
    setEvent(props.data);
  };

  const handleEdit = () => {
    openEditEventModal(event);
    handleClose();
  };

  const deleteEvent = async () => {
    try {
      const response = await CalDavEventsApi.deleteEvent({
        calendarID: calendar.id,
        url: event.url,
        etag: event.etag,
        internalID: event.internalID,
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

  useEffect(() => {
    loadEvent();
    getCalendar();
  }, [store.webcalEvents]);
  useEffect(() => {
    loadEvent();
    getCalendar();
  }, [JSON.stringify(props.data)]);

  return event && event.id ? (
    <ChakraModal
      handleClose={handleClose}
      withCloseButton={false}
      minWidth={400}
      className={'Chakra__modal-padding-2'}
    >
      <>
        <HeaderModal
          isMobile={isMobile}
          isDark={isDark}
          hasHeaderShadow={false}
          onClose={handleClose}
          goBack={handleClose}
          handleEdit={!event.externalID ? handleEdit : null}
          handleDelete={deleteEvent}
        />
        <EventDetailTitle
          isNewEvent={false}
          value={event.summary}
          disabled={true}
        />
        <EventDates event={event} isSmall={false} />
        {calendar && calendar?.displayName ? (
          <EventDetailCalendar calendar={calendar} disabled />
        ) : null}
        {event.location?.length > 0 ? (
          <EventDetailLocation value={event.location} disabled />
        ) : null}
        {event.description?.length > 0 ? (
          <EventDetailNotes value={event.description} disabled />
        ) : null}
      </>
    </ChakraModal>
  ) : null;
};

export default EventView;
