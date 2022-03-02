import '../button/buttonBase/ButtonBase.scss';
import './Calendar.scss';
import 'kalend/dist/styles/index.css';
import {
  AppSettings,
  CalDavAccount,
  CalDavEvent,
  QueryRange,
  ReduxState,
} from '../../types/interface';
import { Context } from '../../context/store';
import { DateTime } from 'luxon';
import { TOAST_STATUS } from '../../types/enums';
import {
  checkIfIsInRange,
  createToast,
  getSyncRange,
} from '../../utils/common';
import { reduxStore } from '../../layers/ReduxProvider';
import { setCalendarDaysRange } from '../../redux/actions';
import { useDispatch, useSelector } from 'react-redux';
import { useToast } from '@chakra-ui/react';
import BottomSheetMobile from '../bottomSheetMobile/BottomSheetMobile';
import CalDavAccountModal from '../accountSelectionModal/calDavAccountModal/CalDavAccountModal';
import CalendarHeader from './CalendarHeader';
import EditEvent, { createEvent } from '../../views/event/editEvent/EditEvent';
import EventView from '../../views/event/eventView/EventView';
import EventsApi from '../../api/EventsApi';
import GeneralApi from '../../api/GeneralApi';
import Kalend, {
  OnEventClickData,
  OnEventDragFinish,
  OnNewEventClickData,
} from 'kalend';
import MobileNavbar from '../mobileNavbar/MobileNavbar';
import React, { useContext, useEffect, useRef, useState } from 'react';

interface CalendarProps {
  isDrawerOpen: boolean;
}
const Calendar = (props: CalendarProps) => {
  const toast = useToast();
  const settings: AppSettings = useSelector(
    (state: ReduxState) => state.settings
  );
  const calDavEvents: CalDavEvent[] = useSelector(
    (state: ReduxState) => state.calDavEvents
  );
  const calDavAccounts: CalDavAccount[] = useSelector(
    (state: ReduxState) => state.calDavAccounts
  );
  const kalendRef: any = useRef();
  const [selectedView, setSelectedView] = useState(settings.defaultView);
  const [selectedDate, setSelectedDate] = useState(
    DateTime.now().toFormat('MMMM yyyy')
  );

  const dispatch = useDispatch();

  const [events, setEvents] = useState<any[]>([]);

  const [isEditingEventOpen, setEditingEventOpen] = useState<any>(null);
  const [isEventViewOpen, setEventViewOpen] = useState<any>(null);
  const [isNewEventOpen, setIsNewEventOpen] = useState<any>(null);
  const [isBottomSheetOpen, openBottomSheet] = useState<any>(false);
  const [currentE, setCurrentE] = useState<any>(null);
  const [toastIsLoading, setToastIsLoading] = useState(false);

  const kalendState: any = useRef({});

  const wasInitRef: any = useRef(false);

  const [store, dispatchContext] = useContext(Context);
  const setContext = (type: string, payload: any) => {
    dispatchContext({ type, payload });
  };

  useEffect(() => {
    setContext('isAppStarting', false);

    setEvents(calDavEvents || []);
  }, []);

  const handleSyncWithRange = async () => {
    try {
      const range: QueryRange = getSyncRange(
        'Monday',
        kalendState?.current?.selectedDate || DateTime.now().toUTC().toString()
      );

      if (!checkIfIsInRange(range)) {
        setToastIsLoading(true);
        if (!toastIsLoading) {
          // toast({
          //   duration: null,
          //   status: 'info',
          //   title: 'Loading',
          //   position: TOAST_POSITION.TOP,
          //   isClosable: false,
          // });
        }
        const rangeEventsResponse = await EventsApi.getEvents(
          kalendState?.current?.range.rangeFrom, // range.rangeFrom,
          kalendState?.current?.range.rangeTo //range.rangeTo
        );

        toast.closeAll();
        setToastIsLoading(false);

        setEvents(rangeEventsResponse?.data);
        return;
      }
      setEvents(reduxStore.getState().calDavEvents || []);
    } catch (e) {
      setToastIsLoading(false);
      toast.closeAll();
    }
  };

  useEffect(() => {
    handleSyncWithRange();
  }, [JSON.stringify(calDavEvents)]); // TODO something better

  const openNewEvent = (eventData: OnNewEventClickData) => {
    setIsNewEventOpen(eventData);
  };
  const handleCloseNewEventModal = () => setIsNewEventOpen(null);

  const openEditingEvent = (eventData: CalDavEvent) => {
    setEditingEventOpen(eventData);
  };
  const handleCloseEditingEventModal = () => setEditingEventOpen(null);

  const handleEventClick = (data: OnEventClickData, e: any) => {
    setEventViewOpen(data);
    setCurrentE(e);
  };

  const closeEventView = () => {
    setEventViewOpen(null);
  };

  const onDraggingFinish: OnEventDragFinish = async (
    prevEvent,
    updatedEvent
  ) => {
    try {
      wasInitRef.current = false;
      await createEvent(updatedEvent, false, undefined, undefined, prevEvent);
    } catch (e: any) {
      toast(createToast(e.response?.data?.message, TOAST_STATUS.ERROR));
    }
  };
  const onPageChange = async () => {
    handleSyncWithRange();
  };

  const onKalendStateChange = (data: any) => {
    dispatch(setCalendarDaysRange(data.range));
    kalendState.current = data;
    setSelectedDate(
      DateTime.fromISO(kalendState?.current?.selectedDate).toFormat('MMMM yyyy')
    );
  };

  const handleRefresh = async () => {
    await GeneralApi.getSync();
  };

  return (
    <div
      className={`Calendar_container${props.isDrawerOpen ? '-collapsed' : ''}`}
    >
      <CalendarHeader
        kalendRef={kalendRef}
        selectedDate={selectedDate}
        selectedView={selectedView}
        setSelectedView={setSelectedView}
        handleRefresh={handleRefresh}
      />
      {/*<Carousel onPageChange={handleCarouselSwipe}>*/}
      <Kalend
        kalendRef={kalendRef}
        onEventClick={handleEventClick}
        onNewEventClick={openNewEvent}
        events={events}
        initialDate={new Date().toISOString()}
        hourHeight={settings.hourHeight}
        timeFormat={settings.timeFormat}
        weekDayStart={settings.startOfWeek}
        initialView={selectedView}
        onEventDragFinish={onDraggingFinish}
        disabledViews={settings.disabledViews}
        // onSelectView={() => {}}
        onPageChange={onPageChange}
        disableMobileDropdown={true}
        calendarIDsHidden={settings.hiddenCalendarIDs}
        onStateChange={onKalendStateChange}
        selectedView={selectedView}
      />
      {/*</Carousel>*/}
      {isNewEventOpen ? (
        calDavAccounts.length ? (
          <EditEvent
            isNewEvent={true}
            event={undefined}
            newEventTime={isNewEventOpen}
            handleClose={handleCloseNewEventModal}
            wasInitRef={wasInitRef}
          />
        ) : (
          <CalDavAccountModal handleClose={handleCloseNewEventModal} />
        )
      ) : null}

      {isEditingEventOpen ? (
        <EditEvent
          isNewEvent={false}
          event={isEditingEventOpen}
          newEventTime={isNewEventOpen}
          handleClose={handleCloseEditingEventModal}
        />
      ) : null}

      {isEventViewOpen ? (
        <EventView
          data={isEventViewOpen}
          handleClose={closeEventView}
          openEditEventModal={openEditingEvent}
          currentE={currentE}
        />
      ) : null}
      {store.isMobile ? (
        <MobileNavbar
          openBottomSheet={() => openBottomSheet(true)}
          kalendRef={kalendRef}
        />
      ) : null}
      {store.isMobile && isBottomSheetOpen ? (
        <BottomSheetMobile
          isBottomSheetOpen={isBottomSheetOpen}
          onClose={() => openBottomSheet(false)}
          selectedView={selectedView}
          setSelectedView={setSelectedView}
        />
      ) : null}
    </div>
  );
};

export default Calendar;
