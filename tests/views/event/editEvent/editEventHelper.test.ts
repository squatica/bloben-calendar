import { CALENDAR_VIEW } from 'kalend/common/enums';
import { CalDavCalendar, User } from '../../../../src/types/interface';
import { CalendarSettingsResponse } from '../../../../src/bloben-interface/calendarSettings/calendarSettings';
import {
  CreateCalDavEventRequest,
  UpdateCalDavEventRequest,
  UpdateRepeatedCalDavEventRequest,
} from '../../../../src/bloben-interface/event/event';
import {
  InitialForm,
  NewEventTime,
  createCalDavEvent,
  createOrganizerAttendee,
  didCalendarChange,
  formatRecurrenceID,
  handleAllDayStatus,
  handleSaveEvent,
  handleSelectCalendar,
  initNewEventOnMount,
  initialFormState,
  loadEvent,
  setExternalEventID,
  updateRepeatedEvent,
} from '../../../../src/views/event/editEvent/editEventHelper';
import { REPEATED_EVENT_CHANGE_TYPE } from '../../../../src/bloben-interface/enums';
import { StoreContext } from '../../../../src/context/store';
import { mockCalDavEventApi } from '../../../mocks/api/CalDavEventApi';
import assert from 'assert';

describe(`[VIEWS] Edit event helper`, function () {
  describe(`handleAllDayStatus`, function () {
    it('allDay', async () => {
      const form: InitialForm = {
        ...initialFormState,
        startAt: '2022-05-07T13:45:30.000Z',
        endAt: '2022-05-07T15:45:30.000Z',
        allDay: true,
      };

      const newForm = handleAllDayStatus(form);

      assert.equal(newForm.startAt, '2022-05-07T00:00:00.000Z');
      assert.equal(newForm.endAt, '2022-05-07T00:00:00.000Z');
      assert.equal(newForm.timezoneStartAt, 'floating');
    });

    it('not allDay', async () => {
      const form: InitialForm = {
        ...initialFormState,
        startAt: '2022-05-07T13:45:30.000Z',
        endAt: '2022-05-07T15:45:30.000Z',
        allDay: false,
      };

      const newForm = handleAllDayStatus(form);

      assert.equal(newForm.startAt, '2022-05-07T13:45:30.000Z');
      assert.equal(newForm.endAt, '2022-05-07T15:45:30.000Z');
      assert.equal(newForm.timezoneStartAt, null);
    });
  });

  describe(`didCalendarChange`, function () {
    it('is new event - not changed', async () => {
      const result = didCalendarChange(
        true,
        false,
        { calendarID: 1 },
        { id: 2 }
      );

      assert.equal(result, false);
    });
    it('is duplicating event - not changed', async () => {
      const result = didCalendarChange(
        false,
        true,
        { calendarID: 1 },
        { id: 2 }
      );

      assert.equal(result, false);
    });
    it('was not changed', async () => {
      const result = didCalendarChange(
        false,
        false,
        { calendarID: 1 },
        { id: 1 }
      );

      assert.equal(result, false);
    });
    it('was changed', async () => {
      const result = didCalendarChange(
        false,
        false,
        { calendarID: 1 },
        { id: 2 }
      );

      assert.equal(result, true);
    });
  });

  describe(`createOrganizerAttendee`, function () {
    it('skip if exists', async () => {
      const organizerEmail = 'hello@bloben.com';

      const result = createOrganizerAttendee({
        attendees: [
          {
            mailto: organizerEmail,
          },
        ],
        organizer: {
          mailto: organizerEmail,
        },
      } as InitialForm);

      assert.equal(result, null);
    });
    it('create if not exists', async () => {
      const organizerEmail = 'hello@bloben.com';

      const result = createOrganizerAttendee({
        attendees: [
          {
            mailto: 'test@bloben.com',
          },
        ],
        organizer: {
          mailto: organizerEmail,
        },
      } as InitialForm);

      assert.equal(result?.mailto, organizerEmail);
    });
  });

  describe(`setExternalEventID`, function () {
    it('use existing - original event', async () => {
      const originalEvent = {
        externalID: '123',
      };
      const result = setExternalEventID(originalEvent, false);

      assert.equal(result, originalEvent.externalID);
    });
    it('use new - duplicating event', async () => {
      const originalEvent = {
        externalID: '123',
      };
      const result = setExternalEventID(originalEvent, true);

      assert.notEqual(result, originalEvent.externalID);
    });
    it('use new ', async () => {
      const originalEvent = {
        id: '1234',
      };
      const result = setExternalEventID(originalEvent, true);

      assert.notEqual(result, originalEvent.id);
      assert.notEqual(result, undefined);
    });
  });

  describe(`createEvent`, function () {
    const startAt = '2022-08-05T14:00:00.000Z';
    const endAt = '2022-08-05T16:00:00.000Z';
    const externalID = 'external_123';

    const form: InitialForm = { ...initialFormState, startAt, endAt };
    const calendar = {
      calDavAccountID: '1',
      id: '123',
      url: 'http://localhost',
    } as CalDavCalendar;

    const originalEvent = {
      id: '1',
      url: 'http://localhost',
      etag: '123',
      externalID,
      calendarID: calendar.id,
    };

    before(() => {
      mockCalDavEventApi();
    });

    it('create simple new event', async () => {
      const result = (await createCalDavEvent(
        form,
        true,
        calendar
      )) as unknown as CreateCalDavEventRequest;

      const icalResult = result.iCalString.split('\n');

      assert.equal(result.calendarID, calendar.id);
      assert.equal(result.sendInvite, undefined);
      assert.equal(result.inviteMessage, undefined);
      assert.equal(icalResult[0], 'BEGIN:VCALENDAR');
      assert.equal(icalResult[5], 'DTSTART:20220805T140000Z');
      assert.equal(icalResult[6], 'DTEND:20220805T160000Z');
      assert.equal(icalResult[13], 'SEQUENCE:0');
    });

    it('create all day new event', async () => {
      const result = (await createCalDavEvent(
        { ...form, allDay: true },
        true,
        calendar
      )) as unknown as CreateCalDavEventRequest;

      const icalResult = result.iCalString.split('\n');

      assert.equal(result.calendarID, calendar.id);
      assert.equal(result.sendInvite, undefined);
      assert.equal(result.inviteMessage, undefined);
      assert.equal(icalResult[5], 'DTSTART;VALUE=DATE:20220805');
      assert.equal(icalResult[6], 'DTEND;VALUE=DATE:20220806');
      assert.equal(icalResult[13], 'SEQUENCE:0');
    });

    it('create new event with attendees', async () => {
      const result = (await createCalDavEvent(
        {
          ...form,
          attendees: [
            {
              CN: 'tester',
              mailto: 'hello@bloben.com',
            },
          ],
          organizer: {
            CN: 'tester',
            mailto: 'hello@bloben.com',
          },
        },
        true,
        calendar
      )) as unknown as CreateCalDavEventRequest;

      const icalResult = result.iCalString.split('\n');

      assert.equal(result.calendarID, calendar.id);
      assert.equal(result.sendInvite, undefined);
      assert.equal(result.inviteMessage, undefined);
      assert.equal(icalResult[5], 'DTSTART:20220805T140000Z');
      assert.equal(icalResult[6], 'DTEND:20220805T160000Z');
      assert.equal(icalResult[8], 'ATTENDEE;CN=tester:mailto:hello@bloben.com');
      assert.equal(
        icalResult[9],
        'ORGANIZER;CN=tester:mailto:hello@bloben.com'
      );
    });

    it('create new event with attendees with invite', async () => {
      const result = (await createCalDavEvent(
        {
          ...form,
          attendees: [
            {
              CN: 'tester',
              mailto: 'hello@bloben.com',
            },
          ],
          organizer: {
            CN: 'tester',
            mailto: 'hello@bloben.com',
          },
        },
        true,
        calendar,
        undefined,
        undefined,
        true,
        'Invite'
      )) as unknown as CreateCalDavEventRequest;

      const icalResult = result.iCalString.split('\n');

      assert.equal(result.calendarID, calendar.id);
      assert.equal(result.sendInvite, true);
      assert.equal(result.inviteMessage, 'Invite');
      assert.equal(icalResult[5], 'DTSTART:20220805T140000Z');
      assert.equal(icalResult[6], 'DTEND:20220805T160000Z');
      assert.equal(icalResult[8], 'ATTENDEE;CN=tester:mailto:hello@bloben.com');
      assert.equal(
        icalResult[9],
        'ORGANIZER;CN=tester:mailto:hello@bloben.com'
      );
    });

    it('update simple event', async () => {
      const result = (await createCalDavEvent(
        form,
        false,
        calendar,
        undefined,
        originalEvent
      )) as unknown as UpdateCalDavEventRequest;

      const icalResult = result.iCalString.split('\n');

      assert.equal(result.calendarID, calendar.id);
      assert.equal(result.sendInvite, undefined);
      assert.equal(result.inviteMessage, undefined);
      assert.equal(result.etag, originalEvent.etag);
      assert.equal(icalResult[0], 'BEGIN:VCALENDAR');
      assert.equal(icalResult[5], 'DTSTART:20220805T140000Z');
      assert.equal(icalResult[6], 'DTEND:20220805T160000Z');
      assert.equal(icalResult[7], 'UID:external_123');
    });

    it('update event with attendees with invite', async () => {
      const result = (await createCalDavEvent(
        {
          ...form,
          attendees: [
            {
              CN: 'tester',
              mailto: 'hello@bloben.com',
            },
          ],
          organizer: {
            CN: 'tester',
            mailto: 'hello@bloben.com',
          },
        },
        false,
        calendar,
        undefined,
        originalEvent,
        true,
        'Invite'
      )) as unknown as UpdateCalDavEventRequest;

      const icalResult = result.iCalString.split('\n');

      assert.equal(result.calendarID, calendar.id);
      assert.equal(result.sendInvite, true);
      assert.equal(result.inviteMessage, 'Invite');
      assert.equal(icalResult[5], 'DTSTART:20220805T140000Z');
      assert.equal(icalResult[6], 'DTEND:20220805T160000Z');
      assert.equal(icalResult[8], 'ATTENDEE;CN=tester:mailto:hello@bloben.com');
      assert.equal(
        icalResult[9],
        'ORGANIZER;CN=tester:mailto:hello@bloben.com'
      );
    });

    it('update event with attendees with invite with calendar changed', async () => {
      const result = (await createCalDavEvent(
        {
          ...form,
          attendees: [
            {
              CN: 'tester',
              mailto: 'hello@bloben.com',
            },
          ],
          organizer: {
            CN: 'tester',
            mailto: 'hello@bloben.com',
          },
        },
        false,
        { ...calendar, id: 'new_cal_1' },
        undefined,
        originalEvent,
        true,
        'Invite'
      )) as unknown as UpdateCalDavEventRequest;

      const icalResult = result.iCalString.split('\n');

      assert.equal(result.calendarID, 'new_cal_1');
      assert.equal(result.sendInvite, true);
      assert.equal(result.inviteMessage, 'Invite');
      assert.equal(icalResult[5], 'DTSTART:20220805T140000Z');
      assert.equal(icalResult[6], 'DTEND:20220805T160000Z');
      assert.equal(icalResult[8], 'ATTENDEE;CN=tester:mailto:hello@bloben.com');
      assert.equal(
        icalResult[9],
        'ORGANIZER;CN=tester:mailto:hello@bloben.com'
      );
    });

    it('update simple event with new calendar', async () => {
      const result = (await createCalDavEvent(
        form,
        false,
        { ...calendar, id: 'new_cal_1' },
        undefined,
        originalEvent
      )) as unknown as UpdateCalDavEventRequest;

      const icalResult = result.iCalString.split('\n');

      assert.equal(result.calendarID, 'new_cal_1');
      assert.equal(result.sendInvite, undefined);
      assert.equal(result.inviteMessage, undefined);
      assert.equal(result.etag, originalEvent.etag);
      assert.notEqual(result.externalID, originalEvent.id);
      assert.equal(icalResult[0], 'BEGIN:VCALENDAR');
      assert.equal(icalResult[5], 'DTSTART:20220805T140000Z');
      assert.equal(icalResult[6], 'DTEND:20220805T160000Z');
      assert.equal(icalResult[7], 'UID:external_123');
    });

    it('update duplicating event', async () => {
      const result = (await createCalDavEvent(
        form,
        false,
        calendar,
        undefined,
        originalEvent,
        undefined,
        undefined,
        true
      )) as unknown as UpdateCalDavEventRequest;

      const icalResult = result.iCalString.split('\n');

      assert.equal(result.calendarID, calendar.id);
      assert.equal(result.sendInvite, undefined);
      assert.equal(result.inviteMessage, undefined);
      assert.notEqual(result.externalID, originalEvent.id);
      assert.equal(icalResult[0], 'BEGIN:VCALENDAR');
      assert.equal(icalResult[5], 'DTSTART:20220805T140000Z');
      assert.equal(icalResult[6], 'DTEND:20220805T160000Z');
      assert.notEqual(icalResult[7], 'UID:external_123');
    });
  });

  describe(`initNewEventOnMount`, function () {
    const settings: CalendarSettingsResponse = {
      defaultCalendarID: '123',
    } as CalendarSettingsResponse;

    const user = {
      username: 'tester',
    } as User;

    const store = {
      emailConfig: {
        hasSystemConfig: false,
        hasCustomConfig: false,
        mailto: null,
      },
    } as StoreContext;

    const newEventTime = {
      isHeaderClick: false,
      event: {},
      hour: 11,
      startAt: '2022-08-05T14:00:00.000Z',
      endAt: '2022-08-05T16:00:00.000Z',
      view: CALENDAR_VIEW.WEEK,
    } as NewEventTime;

    const calDavCalendars: CalDavCalendar[] = [
      {
        id: 'aaaa',
        displayName: 'bbbb',
        calDavAccountID: 'cccc',
        url: '654',
      } as CalDavCalendar,
      {
        id: '123',
        displayName: 'cal',
        calDavAccountID: '234',
        url: '345',
        alarms: [
          {
            id: '123',
          },
        ],
      } as CalDavCalendar,
    ];

    let form: any = {};
    let calendar: any;
    const setCalendar = (value: any) => {
      calendar = value;
    };
    const setForm = (key: string, value: string) => {
      form[key] = value;
    };

    beforeEach(() => {
      form = {};
      calendar = undefined;
    });

    it('load default calendar', async () => {
      initNewEventOnMount(
        settings,
        calDavCalendars,
        setForm,
        setCalendar,
        store,
        user,
        newEventTime
      );

      assert.equal(calendar.id, settings.defaultCalendarID);
      assert.equal(form.calendarUrl, '345');
    });

    it('should load any calendar', async () => {
      initNewEventOnMount(
        { ...settings, defaultCalendarID: null },
        calDavCalendars,
        setForm,
        setCalendar,
        store,
        user,
        newEventTime
      );

      assert.equal(calendar.id, calDavCalendars[0].id);
      assert.equal(form.calendarUrl, calDavCalendars[0].url);
    });

    it('should set calendar alarms', async () => {
      initNewEventOnMount(
        settings,
        calDavCalendars,
        setForm,
        setCalendar,
        store,
        user,
        newEventTime
      );

      assert.equal(form.alarms.length, 1);
    });

    it('should set organizer', async () => {
      initNewEventOnMount(
        settings,
        calDavCalendars,
        setForm,
        setCalendar,
        {
          ...store,
          ...{
            emailConfig: {
              hasSystemConfig: true,
              mailto: 'hello@bloben.com',
            },
          },
        } as any,
        user,
        newEventTime
      );

      assert.equal(form.organizer.CN, user.username);
    });

    it('should set all day for month', async () => {
      initNewEventOnMount(
        settings,
        calDavCalendars,
        setForm,
        setCalendar,
        store,
        user,
        { ...newEventTime, ...{ view: 'month' } } as any
      );

      assert.equal(form.allDay, true);
      assert.equal(form.timezoneStartAt, 'floating');
      assert.equal(form.startAt.slice(0, 13), '2022-08-05T00');
      assert.equal(form.endAt.slice(0, 13), '2022-08-05T00');
    });

    it('should set all day for header click', async () => {
      initNewEventOnMount(
        settings,
        calDavCalendars,
        setForm,
        setCalendar,
        store,
        user,
        { ...newEventTime, ...{ isHeaderClick: true } } as any
      );

      assert.equal(form.allDay, true);
      assert.equal(form.timezoneStartAt, 'floating');
      assert.equal(form.startAt.slice(0, 13), '2022-08-05T00');
      assert.equal(form.endAt.slice(0, 13), '2022-08-05T00');
    });

    it('should set dates for normal event', async () => {
      initNewEventOnMount(
        settings,
        calDavCalendars,
        setForm,
        setCalendar,
        store,
        user,
        newEventTime
      );

      assert.equal(form.allDay, undefined);
      assert.notEqual(form.timezoneStartAt, 'floating');
      assert.equal(form.startAt, '2022-08-05T14:00:00.000Z');
      assert.equal(form.endAt, '2022-08-05T16:00:00.000Z');
    });
  });

  describe(`loadEvent`, function () {
    const event: any = {
      id: '123',
      startAt: '2022-08-05T14:00:00.000Z',
      endAt: '2022-08-05T16:00:00.000Z',
    };

    let form: any = {};
    let wasSimpleEvent: any;

    const setForm = (key: string, value: string) => {
      form[key] = value;
    };

    const setWasSimpleEvent = (value: boolean) => {
      wasSimpleEvent = value;
    };

    beforeEach(() => {
      form = {};
      wasSimpleEvent = undefined;
    });

    it('should set prev event default calendar', async () => {
      loadEvent(event, setForm, setWasSimpleEvent);

      assert.equal(form.prevItem.id, event.id);
      assert.equal(wasSimpleEvent, true);
    });
    it('should set was repeated with rrule', async () => {
      loadEvent({ ...event, rRule: 'abc' }, setForm, setWasSimpleEvent);

      assert.equal(wasSimpleEvent, false);
    });
    it('should set was repeated with recurrenceID', async () => {
      loadEvent({ ...event, recurrenceID: 'abc' }, setForm, setWasSimpleEvent);

      assert.equal(wasSimpleEvent, false);
    });
    it('should set known props', async () => {
      loadEvent(
        {
          ...event,
          valarms: [{ id: 'abc' }],
          summary: 'test',
          location: 'aabbc\\nnasf',
        },
        setForm,
        setWasSimpleEvent
      );

      assert.equal(form.alarms.length, 1);
      assert.equal(form.summary, 'test');
      assert.equal(form.location, 'aabbc\nnasf');
    });
  });

  describe(`handleSelectCalendar`, function () {
    const calendarObj: any = {
      id: '123',
      url: 'http://localhost',
      timezone: 'UTC',
      alarms: [
        {
          trigger: '1',
        },
      ],
    };

    const startAt = '2022-08-05T14:00:00.000Z';
    const endAt = '2022-08-05T16:00:00.000Z';
    let form: any = {};
    let calendar: any;

    const setForm = (key: string, value: string) => {
      form[key] = value;
    };

    const setCalendar = (value: boolean) => {
      calendar = value;
    };

    beforeEach(() => {
      form = {};
      calendar = undefined;
    });

    it('should set calendar', async () => {
      handleSelectCalendar(calendarObj, setForm, setCalendar, startAt, endAt);

      assert.equal(form.startAt.slice(0, 10), '2022-08-05');
      assert.equal(form.endAt.slice(0, 10), '2022-08-05');
      assert.equal(form.calendarUrl, calendarObj.url);
      assert.equal(form.color, null);
      assert.equal(form.alarms.length, 1);
      assert.equal(calendar.id, calendarObj.id);
    });
  });

  describe(`handleSaveEvent`, function () {
    mockCalDavEventApi();

    let eventInviteModalOpened: any;
    const form: any = {};
    let toast: any;

    const openEmailInviteModal = (data: any) => {
      eventInviteModalOpened = data;
    };

    const emptyFunc = () => {
      return {};
    };

    const setToast = (data: any) => {
      return (toast = data);
    };

    beforeEach(() => {
      eventInviteModalOpened = undefined;
      toast = undefined;
    });

    const calendar = {
      id: 'aaaa',
      displayName: 'bbbb',
      calDavAccountID: 'cccc',
      url: '654',
    };

    it('should save new event with invite modal', async () => {
      await handleSaveEvent(
        true,
        openEmailInviteModal,
        form,
        true,
        calendar,
        undefined,
        {
          id: 1,
        },
        false,
        emptyFunc,
        { syncSequence: 1 } as StoreContext,
        false,
        emptyFunc,
        emptyFunc,
        emptyFunc
      );

      assert.notEqual(eventInviteModalOpened.call, undefined);
    });
    it('should save new event without invite modal', async () => {
      await handleSaveEvent(
        false,
        openEmailInviteModal,
        form,
        true,
        calendar,
        undefined,
        {
          id: 1,
        },
        false,
        emptyFunc,
        { syncSequence: 1 } as StoreContext,
        false,
        emptyFunc,
        emptyFunc,
        setToast
      );

      assert.equal(eventInviteModalOpened, undefined);
      assert.equal(toast.title, 'Event created');
    });
    it('should update repeated event', async () => {
      await handleSaveEvent(
        false,
        openEmailInviteModal,
        { ...form, rRule: 'aa' },
        false,
        calendar,
        undefined,
        {
          id: 1,
        },
        false,
        emptyFunc,
        { syncSequence: 1 } as StoreContext,
        false,
        emptyFunc,
        emptyFunc,
        setToast
      );

      assert.equal(eventInviteModalOpened, undefined);
      assert.equal(toast.title, 'Event updated');
    });
  });

  describe(`updateRepeatedEvent`, function () {
    const startAt = '2022-08-05T14:00:00.000Z';
    const endAt = '2022-08-05T16:00:00.000Z';
    const externalID = 'external_123';

    const form: InitialForm = { ...initialFormState, startAt, endAt };
    const calendar = {
      calDavAccountID: '1',
      id: '123',
      url: 'http://localhost',
    } as CalDavCalendar;

    const originalEvent = {
      id: '1',
      url: 'http://localhost',
      etag: '123',
      externalID,
      calendarID: calendar.id,
    };

    before(() => {
      mockCalDavEventApi();
    });

    it('update event', async () => {
      const result = (await updateRepeatedEvent(
        form,
        REPEATED_EVENT_CHANGE_TYPE.SINGLE,
        calendar,
        undefined,
        originalEvent,
        undefined,
        undefined
      )) as unknown as UpdateRepeatedCalDavEventRequest;

      assert.equal(result.calendarID, calendar.id);
      assert.equal(result.sendInvite, undefined);
      assert.equal(result.inviteMessage, undefined);
      assert.equal(result.event.externalID, originalEvent.externalID);
      assert.equal(result.externalID, originalEvent.externalID);
      assert.equal(result.id, originalEvent.id);
      assert.equal(result.prevEvent, undefined);
    });

    it('update event with invite', async () => {
      const result = (await updateRepeatedEvent(
        form,
        REPEATED_EVENT_CHANGE_TYPE.SINGLE,
        calendar,
        undefined,
        originalEvent,
        true,
        'Invite'
      )) as unknown as UpdateRepeatedCalDavEventRequest;

      assert.equal(result.calendarID, calendar.id);
      assert.equal(result.sendInvite, true);
      assert.equal(result.inviteMessage, 'Invite');
      assert.equal(result.event.externalID, originalEvent.externalID);
      assert.equal(result.externalID, originalEvent.externalID);
      assert.equal(result.id, originalEvent.id);
      assert.equal(result.prevEvent, undefined);
    });
    it('update event with calendar changed', async () => {
      const result = (await updateRepeatedEvent(
        form,
        REPEATED_EVENT_CHANGE_TYPE.SINGLE,
        { ...calendar, id: '4341412' },
        undefined,
        originalEvent,
        undefined,
        undefined
      )) as unknown as UpdateRepeatedCalDavEventRequest;

      assert.equal(result.calendarID, '4341412');
      assert.equal(result.sendInvite, undefined);
      assert.equal(result.inviteMessage, undefined);
      assert.equal(result.event.externalID, originalEvent.externalID);
      assert.equal(result.externalID, originalEvent.externalID);
      assert.equal(result.id, originalEvent.id);
      assert.equal(result.prevEvent?.externalID, originalEvent.externalID);
    });
  });

  describe(`formatRecurrenceID`, function () {
    const event: any = {
      id: '123',
      startAt: '2022-08-05T14:00:00.000Z',
      endAt: '2022-08-05T16:00:00.000Z',
    };

    const form: any = {
      timezoneStartAt: 'Europe/Berlin',
    };

    it(`should return undefined for type ${REPEATED_EVENT_CHANGE_TYPE.ALL}`, async () => {
      const result = formatRecurrenceID(form, REPEATED_EVENT_CHANGE_TYPE.ALL);

      assert.equal(result, undefined);
    });
    it(`should return recurrenceID`, async () => {
      const result = formatRecurrenceID(
        { ...form, recurrenceID: '123' },
        REPEATED_EVENT_CHANGE_TYPE.SINGLE
      );

      assert.equal(result, '123');
    });
    it(`should obj`, async () => {
      const result = formatRecurrenceID(
        form,
        REPEATED_EVENT_CHANGE_TYPE.SINGLE,
        event
      );
      const result2 = formatRecurrenceID(
        form,
        REPEATED_EVENT_CHANGE_TYPE.SINGLE_RECURRENCE_ID,
        event
      );
      const result3 = formatRecurrenceID(
        form,
        REPEATED_EVENT_CHANGE_TYPE.THIS_AND_FUTURE,
        event
      );

      assert.equal(result.timezone, form.timezoneStartAt);
      assert.equal(result.value, '20220805T160000');
      assert.equal(result2.timezone, form.timezoneStartAt);
      assert.equal(result2.value, '20220805T160000');
      assert.equal(result3.timezone, form.timezoneStartAt);
      assert.equal(result3.value, '20220805T160000');
    });
  });
});
