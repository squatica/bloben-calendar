/* tslint:disable:no-magic-numbers */
import React from 'react';

import './EventDetail.scss';

import { CalDavCalendar } from '../../../types/interface';
import { Stack } from '@chakra-ui/react';
import EventDetailAttendee from '../../../components/eventDetail/eventDetailAttendee/EventDetailAttendee';
import EventDetailCalendar from '../../../components/eventDetail/eventDetailCalendar/EventDetailCalendar';
import EventDetailColor from '../../../components/eventDetail/eventDetailColor/EventDetailColor';
import EventDetailDates from '../../../components/eventDetail/eventDetailDates/EventDetailDates';
import EventDetailLocation from '../../../components/eventDetail/eventDetailLocation/EventDetailLocation';
import EventDetailNotes from '../../../components/eventDetail/eventDetailNotes/EventDetailNotes';
import EventDetailRepeat from '../../../components/eventDetail/eventDetailRepeat/EventDetailRepeat';
import EventDetailTitle from 'components/eventDetail/eventDetailTitle/EventDetailTitle';

interface EventDetailProps {
  summary: string;
  handleChange: any;
  calendar: CalDavCalendar;
  location: string;
  startDate: string;
  endDate: string;
  isRepeated: boolean;
  isStartDateValid?: any;
  description: string;
  allDay: boolean;
  setForm: any;
  rRule: string;
  alarms: any;
  addAlarm: any;
  removeAlarm: any;
  isNewEvent: boolean;
  handleChangeDateFrom: any;
  handleChangeDateTill: any;
  timezoneStartAt: string;
  setStartTimezone: any;
  selectCalendar: any;
  organizer: any;
  attendees: any[];
  addAttendee: any;
  removeAttendee: any;
  makeOptional?: any;
  form?: any;
  updateAttendee?: any;
  color?: string;
}
const EventDetail = (props: EventDetailProps) => {
  const {
    summary,
    handleChange,
    calendar,
    location,
    startDate,
    endDate,
    isRepeated,
    description,
    allDay,
    setForm,
    isNewEvent,
    handleChangeDateFrom,
    handleChangeDateTill,
    timezoneStartAt,
    setStartTimezone,
    selectCalendar,
    addAttendee,
    removeAttendee,
    attendees,
    form,
    updateAttendee,
    color,
  } = props;

  return (
    <Stack spacing={1}>
      <EventDetailTitle
        isNewEvent={isNewEvent}
        value={summary}
        handleChange={handleChange}
      />
      <EventDetailCalendar
        calendar={calendar}
        selectCalendar={selectCalendar}
      />
      <EventDetailDates
        startDate={startDate}
        setForm={setForm}
        timezoneStartAt={timezoneStartAt}
        endDate={endDate}
        timezoneEndAt={timezoneStartAt}
        handleChangeDateFrom={handleChangeDateFrom}
        handleChangeDateTill={handleChangeDateTill}
        allDay={allDay}
        setStartTimezone={setStartTimezone}
      />
      <EventDetailColor color={color} setForm={setForm} />
      <EventDetailRepeat
        isRepeated={isRepeated}
        setForm={setForm}
        form={form}
      />
      <EventDetailAttendee
        addAttendee={addAttendee}
        removeAttendee={removeAttendee}
        updateAttendee={updateAttendee}
        attendees={attendees}
      />
      <EventDetailLocation handleChange={handleChange} value={location} />
      <EventDetailNotes handleChange={handleChange} value={description} />
    </Stack>
  );
};

export default EventDetail;
