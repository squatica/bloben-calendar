export type AttendeeRole = 'REQ-PARTICIPANT' | 'OPT-PARTICIPANT';

export const ROLE_REQ: AttendeeRole = 'REQ-PARTICIPANT';
export const ROLE_OPT: AttendeeRole = 'OPT-PARTICIPANT';

export type Rsvp = 'TRUE' | 'FALSE';

export const RSVP_TRUE: Rsvp = 'TRUE';
export const RSVP_FALSE: Rsvp = 'FALSE';

export type AttendeeResponse =
  | 'NEEDS-ACTION'
  | 'ACCEPTED'
  | 'DECLINED'
  | 'TENTATIVE';

export const WAITING_ATTENDEE: AttendeeResponse = 'NEEDS-ACTION';
export const ACCEPTED_ATTENDEE: AttendeeResponse = 'ACCEPTED';
export const DECLINED_ATTENDEE: AttendeeResponse = 'DECLINED';
export const TENTATIVE_ATTENDEE: AttendeeResponse = 'TENTATIVE';

export type Partstat = 'NEEDS-ACTION' | 'ACCEPTED' | 'DECLINED' | 'TENTATIVE';

export const PARTSTAT_NEED_ACTION: Partstat = 'NEEDS-ACTION';
export const PARTSTAT_ACCEPTED: Partstat = 'ACCEPTED';
export const PARTSTAT_DECLINED: Partstat = 'DECLINED';
export const PARTSTAT_TENTATIVE: Partstat = 'TENTATIVE';

export type PartstatHuman = 'accept' | 'reject' | 'maybe';
export const PARTSTAT_HUMAN_ACCEPT: PartstatHuman = 'accept';
export const PARTSTAT_HUMAN_REJECT: PartstatHuman = 'reject';
export const PARTSTAT_HUMAN_MAYBE: PartstatHuman = 'maybe';

export const translatePartstatHumanToIcal = (
  value: PartstatHuman
): Partstat => {
  switch (value) {
    case PARTSTAT_HUMAN_ACCEPT:
      return PARTSTAT_ACCEPTED;
    case PARTSTAT_HUMAN_REJECT:
      return PARTSTAT_DECLINED;
    case PARTSTAT_HUMAN_MAYBE:
      return PARTSTAT_TENTATIVE;
    default:
      return PARTSTAT_NEED_ACTION;
  }
};

export const translatePartstatIcalToHuman = (
  value: Partstat
): PartstatHuman => {
  switch (value) {
    case PARTSTAT_ACCEPTED:
      return PARTSTAT_HUMAN_ACCEPT;
    case PARTSTAT_DECLINED:
      return PARTSTAT_HUMAN_REJECT;
    case PARTSTAT_TENTATIVE:
      return PARTSTAT_HUMAN_MAYBE;
    default:
      return PARTSTAT_HUMAN_MAYBE;
  }
};

export interface Attendee {
  cn: string;
  role: AttendeeRole;
  rsvp: Rsvp;
  partstat: Partstat;
  mailto: string;
}

export interface AttendeeData {
  name?: string;
  email: string;
}

export const createAttendee = (data: AttendeeData): Attendee => {
  const { name, email } = data;

  return {
    cn: name ? name : email,
    role: ROLE_REQ,
    rsvp: RSVP_TRUE,
    partstat: PARTSTAT_NEED_ACTION,
    mailto: email,
  };
};

export const createOrganizerAttendee = (
  mailto: string,
  cn: string
): Attendee => {
  return {
    cn: cn ? cn : mailto,
    role: ROLE_REQ,
    rsvp: RSVP_TRUE,
    partstat: PARTSTAT_ACCEPTED,
    mailto,
  };
};

export const makeOptionalAttendee = (
  item: Attendee,
  attendees: Attendee[],
  setState: any
) => {
  const items: Attendee[] = [...attendees];
  const result: any = items.map((attendee: Attendee) => {
    if (attendee.mailto === item.mailto) {
      if (attendee.role === ROLE_REQ) {
        attendee.role = ROLE_OPT;
      } else {
        attendee.role = ROLE_REQ;
      }
    }

    return attendee;
  });

  setState('attendees', result);
};
