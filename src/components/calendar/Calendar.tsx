import '../button/buttonBase/ButtonBase.scss';
import './Calendar.scss';
import 'kalend/dist/styles/index.css';
import { CALENDAR_VIEW } from 'kalend-layout';
import {
  CalDavAccount,
  CalDavCalendar,
  CalDavEvent,
  QueryRange,
  ReduxState,
} from '../../types/interface';
import { CalendarSettingsResponse } from '../../bloben-interface/calendarSettings/calendarSettings';
import { Context } from '../../context/store';
import { DateTime } from 'luxon';
import {
  EVENT_TYPE,
  REPEATED_EVENT_CHANGE_TYPE,
} from '../../bloben-interface/enums';
import {
  InitialForm,
  createEvent,
  updateRepeatedEvent,
} from '../../views/event/editEvent/EditEvent.utils';
import { SettingsLocal } from '../../redux/reducers/settingsLocal';
import { TOAST_STATUS } from '../../types/enums';
import {
  checkIfIsInRange,
  createToast,
  getSyncRange,
  parseCssDark,
} from '../../utils/common';
import { reduxStore } from '../../layers/ReduxProvider';
import { setCalendarDaysRange, setLocalSettings } from '../../redux/actions';
import { useDispatch, useSelector } from 'react-redux';
import { useToast } from '@chakra-ui/react';
import { useWidth } from '../../utils/layout';
import BottomSheetMobile from '../bottomSheetMobile/BottomSheetMobile';
import CalDavAccountModal from '../accountSelectionModal/calDavAccountModal/CalDavAccountModal';
import CalendarHeader from './CalendarHeader';
import DrawerDesktop from '../drawerDesktop/DrawerDesktop';
import EditEvent from '../../views/event/editEvent/EditEvent';
import EventView, {
  checkIfHasRepeatPreAction,
} from '../../views/event/eventView/EventView';
import EventsApi from '../../api/EventsApi';
import GeneralApi from '../../api/GeneralApi';
import Kalend, {
  OnEventClickData,
  OnEventDragFinish,
  OnNewEventClickData,
} from 'kalend';
import MobileNavbar from '../mobileNavbar/MobileNavbar';
import React, { useContext, useEffect, useRef, useState } from 'react';
import RepeatEventModal, {
  REPEAT_MODAL_TYPE,
} from '../repeatEventModal/RepeatEventModal';
import SendInviteModal from '../sendInviteModalModal/SendInviteModal';

const Calendar = () => {
  const toast = useToast();
  const settingsLocal: SettingsLocal = useSelector(
    (state: ReduxState) => state.settingsLocal
  );
  const settings: CalendarSettingsResponse = useSelector(
    (state: ReduxState) => state.calendarSettings
  );
  const calDavEvents: CalDavEvent[] = useSelector(
    (state: ReduxState) => state.calDavEvents
  );
  const calDavAccounts: CalDavAccount[] = useSelector(
    (state: ReduxState) => state.calDavAccounts
  );
  const calDavCalendars: CalDavCalendar[] = useSelector(
    (state: ReduxState) => state.calDavCalendars
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
  const [isRepeatModalOpen, setRepeatModalOpen] = useState<any>(null);
  const [isBottomSheetOpen, openBottomSheet] = useState<any>(false);
  const [currentE, setCurrentE] = useState<any>(null);
  const [toastIsLoading, setToastIsLoading] = useState(false);
  const [emailInviteModalVisible, openEmailInviteModal] = useState<any>(null);

  const kalendState: any = useRef({});

  const wasInitRef: any = useRef(false);
  const hasEmailConfigRef = useRef(false);

  const [store, dispatchContext] = useContext(Context);
  const setContext = (type: string, payload: any) => {
    dispatchContext({ type, payload });
  };

  useEffect(() => {
    hasEmailConfigRef.current =
      store?.emailConfig?.hasSystemConfig ||
      store?.emailConfig?.hasCustomConfig;
  }, [JSON.stringify(store.emailConfig)]);

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

  const openNewEvent = (eventData: OnNewEventClickData, e: any) => {
    setIsNewEventOpen(eventData);
    setCurrentE(e);
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

      // handle more update options for repeated events
      if (checkIfHasRepeatPreAction(updatedEvent)) {
        setRepeatModalOpen({ updatedEvent, prevEvent });
        return;
      }

      if (updatedEvent?.attendees?.length && hasEmailConfigRef.current) {
        openEmailInviteModal({
          call: async (sendInvite?: boolean, inviteMessage?: string) => {
            await createEvent(
              updatedEvent as InitialForm,
              false,
              undefined,
              undefined,
              prevEvent,
              sendInvite,
              inviteMessage
            );
          },
        });

        return;
      }

      await createEvent(
        updatedEvent as InitialForm,
        false,
        undefined,
        undefined,
        prevEvent
      );
    } catch (e: any) {
      toast(createToast(e.response?.data?.message, TOAST_STATUS.ERROR));
    }
  };

  const handleUpdateRepeatedEvent = async (
    value: REPEATED_EVENT_CHANGE_TYPE
  ) => {
    if (!isRepeatModalOpen) {
      return;
    }

    if (
      isRepeatModalOpen.updatedEvent?.attendees?.length &&
      hasEmailConfigRef.current
    ) {
      openEmailInviteModal({
        call: async (sendInvite?: boolean, inviteMessage?: string) => {
          await updateRepeatedEvent(
            isRepeatModalOpen.updatedEvent,
            value,
            undefined,
            undefined,
            isRepeatModalOpen.prevEvent,
            sendInvite,
            inviteMessage
          );
        },
      });

      setRepeatModalOpen(false);

      return;
    }

    await updateRepeatedEvent(
      isRepeatModalOpen.updatedEvent,
      value,
      undefined,
      undefined,
      isRepeatModalOpen.prevEvent
    );

    setRepeatModalOpen(false);
  };

  const onPageChange = async () => {
    handleSyncWithRange();
  };

  const onKalendStateChange = (data: any) => {
    // workaround for navigating to day view internal
    if (data.calendarDays.length === 1) {
      setSelectedView(CALENDAR_VIEW.DAY);
    }

    dispatch(setCalendarDaysRange(data.range));
    kalendState.current = data;
    setSelectedDate(
      DateTime.fromISO(kalendState?.current?.selectedDate).toFormat('MMMM yyyy')
    );
  };

  const handleRefresh = async () => {
    await GeneralApi.getSync();

    await handleSyncWithRange();
  };

  const handleOpenDrawer = () => {
    dispatch(
      setLocalSettings({
        drawerOpen: !settingsLocal.drawerOpen,
      })
    );
  };

  const width = useWidth();

  return (
    <div className={'Main__content__row'}>
      {settingsLocal.drawerOpen ? <DrawerDesktop /> : null}
      <div
        className={parseCssDark(
          `Calendar_container${settingsLocal.drawerOpen ? '-collapsed' : ''}`,
          store.isDark
        )}
        style={{
          width: settingsLocal.drawerOpen ? width - 200 : width,
        }}
      >
        <CalendarHeader
          kalendRef={kalendRef}
          selectedDate={selectedDate}
          selectedView={selectedView}
          setSelectedView={setSelectedView}
          handleRefresh={handleRefresh}
          handleOpenDrawer={handleOpenDrawer}
        />
        {settings.defaultView ? (
          <Kalend
            kalendRef={kalendRef}
            onEventClick={handleEventClick}
            onNewEventClick={openNewEvent}
            events={events}
            initialDate={new Date().toISOString()}
            hourHeight={settings.hourHeight}
            timeFormat={settings.timeFormat.toString()}
            weekDayStart={settings.startOfWeek}
            initialView={settings.defaultView}
            onEventDragFinish={onDraggingFinish}
            // disabledViews={settings.disabledViews}
            draggingDisabledConditions={{
              type: EVENT_TYPE.WEBCAL,
            }}
            // onSelectView={() => {}}
            onPageChange={onPageChange}
            disableMobileDropdown={true}
            // calendarIDsHidden={settings.hiddenCalendarIDs}
            onStateChange={onKalendStateChange}
            selectedView={selectedView || settings.defaultView}
            isNewEventOpen={isNewEventOpen !== null}
            showTimeLine={true}
            timezone={settings.timezone}
            showWeekNumbers={settings.showWeekNumbers}
            autoScroll={true}
            isDark={store.isDark}
          />
        ) : null}
        {isNewEventOpen ? (
          calDavAccounts.length && calDavCalendars.length ? (
            <EditEvent
              isNewEvent={true}
              event={undefined}
              newEventTime={isNewEventOpen}
              handleClose={handleCloseNewEventModal}
              wasInitRef={wasInitRef}
              currentE={currentE}
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
            currentE={currentE}
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

        {isRepeatModalOpen ? (
          <RepeatEventModal
            type={REPEAT_MODAL_TYPE.UPDATE}
            handleClose={() => setRepeatModalOpen(null)}
            title={''}
            handleClick={handleUpdateRepeatedEvent}
          />
        ) : null}

        {emailInviteModalVisible ? (
          <SendInviteModal
            handleClose={() => openEmailInviteModal(null)}
            clickData={emailInviteModalVisible}
          />
        ) : null}
      </div>
    </div>
  );
};

export default Calendar;
