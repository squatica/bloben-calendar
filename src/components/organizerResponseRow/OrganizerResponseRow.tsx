import { ATTENDEE_PARTSTAT, REPEATED_EVENT_CHANGE_TYPE } from '../../enums';
import { Button, Stack, useToast } from '@chakra-ui/react';
import { Context, StoreContext } from '../../context/store';
import { SOURCE_TYPE } from 'bloben-interface/enums';
import { TOAST_STATUS } from '../../types/enums';

import { UpdatePartstatStatusRepeatedEventRequest } from 'bloben-interface';
import { createToast } from '../../utils/common';
import { find } from 'lodash';
import CalDavEventsApi from '../../api/CalDavEventsApi';
import React, { useContext, useState } from 'react';
import RepeatEventModal, {
  REPEAT_MODAL_TYPE,
} from '../repeatEventModal/RepeatEventModal';
import SendInviteModal from '../sendInviteModalModal/SendInviteModal';

interface OrganizerResponseRowProps {
  event: any;
  handleClose: any;
}
const OrganizerResponseRow = (props: OrganizerResponseRowProps) => {
  const [store]: [StoreContext] = useContext(Context);

  const { emailConfig } = store;

  const { event, handleClose } = props;
  const toast = useToast();
  const [emailInviteModalVisible, openEmailInviteModal] = useState<any>(null);
  const [repeatEventStatus, setRepeatEventStatus] =
    useState<ATTENDEE_PARTSTAT | null>(null);

  const emailInviteGuest = find(
    event?.attendees,
    (item) => item?.mailto === emailConfig?.mailto
  );

  const organizer = find(
    event?.attendees,
    (item) => item?.mailto === event?.organizer?.mailto && !emailInviteGuest
  );

  const partStat: ATTENDEE_PARTSTAT | undefined =
    emailInviteGuest?.PARTSTAT || organizer?.PARTSTAT;

  const updateStatus = async (eventID: string, data: any) => {
    if (partStat === data.status) {
      return;
    }

    try {
      const response = await CalDavEventsApi.updateStatus(eventID, data);

      if (response.data?.message) {
        toast(createToast(response.data.message));
      }

      handleClose();
    } catch (e: any) {
      toast(createToast(e.response?.data?.message, TOAST_STATUS.ERROR));
    }
  };

  const updateRepeatedEventStatus = async (
    eventID: string,
    data: UpdatePartstatStatusRepeatedEventRequest
  ) => {
    try {
      const response = await CalDavEventsApi.updateStatusForRepeatedEvent(
        eventID,
        data
      );

      if (response.data?.message) {
        toast(createToast(response.data.message));
      }

      handleClose();
    } catch (e: any) {
      toast(createToast(e.response?.data?.message, TOAST_STATUS.ERROR));
    }
  };

  const handleClick = async (status: ATTENDEE_PARTSTAT) => {
    if (event.rRule || event.recurrenceID?.value) {
      setRepeatEventStatus(status);
    } else {
      openEmailInviteModal({
        call: async (sendInvite?: boolean, inviteMessage?: string) => {
          await updateStatus(event.id, { status, sendInvite, inviteMessage });
        },
      });
    }
  };

  const handleUpdateRepeatedEvent = async (
    type: REPEATED_EVENT_CHANGE_TYPE
  ) => {
    if (!repeatEventStatus) {
      return;
    }
    openEmailInviteModal({
      call: async (sendInvite?: boolean, inviteMessage?: string) => {
        await updateRepeatedEventStatus(event.id, {
          status: repeatEventStatus,
          type,
          recurrenceID: {
            value: event.startAt,
            timezone: event.timezoneStartAt || null,
          },
          startAt: event.startAt,
          endAt: event.endAt,
          sendInvite,
          inviteMessage,
        });
      },
    });

    setRepeatEventStatus(null);
  };

  const disabled = event.sourceType === SOURCE_TYPE.WEBCAL;

  const showRepeatEventModal =
    (!!event.rRule || event.recurrenceID?.value) && repeatEventStatus;

  return organizer || emailInviteGuest ? (
    <Stack
      direction={'row'}
      spacing={3}
      justifyContent={'flex-end'}
      style={{ marginTop: 16 }}
    >
      {showRepeatEventModal ? (
        <RepeatEventModal
          type={REPEAT_MODAL_TYPE.PARTSTAT}
          handleClose={handleClose}
          title={''}
          handleClick={(value: REPEATED_EVENT_CHANGE_TYPE) => {
            handleUpdateRepeatedEvent(value);
          }}
        />
      ) : null}
      <Button
        variant={partStat === ATTENDEE_PARTSTAT.ACCEPTED ? 'solid' : 'ghost'}
        colorScheme={partStat === ATTENDEE_PARTSTAT.ACCEPTED ? 'pink' : 'gray'}
        onClick={() => handleClick(ATTENDEE_PARTSTAT.ACCEPTED)}
        disabled={disabled}
      >
        Going
      </Button>
      <Button
        variant={partStat === ATTENDEE_PARTSTAT.TENTATIVE ? 'solid' : 'ghost'}
        colorScheme={partStat === ATTENDEE_PARTSTAT.TENTATIVE ? 'pink' : 'gray'}
        onClick={() => handleClick(ATTENDEE_PARTSTAT.TENTATIVE)}
        disabled={disabled}
      >
        Maybe
      </Button>
      <Button
        variant={partStat === ATTENDEE_PARTSTAT.DECLINED ? 'solid' : 'ghost'}
        colorScheme={partStat === ATTENDEE_PARTSTAT.DECLINED ? 'pink' : 'gray'}
        onClick={() => handleClick(ATTENDEE_PARTSTAT.DECLINED)}
        disabled={disabled}
      >
        No
      </Button>
      {emailInviteModalVisible ? (
        <SendInviteModal
          handleClose={handleClose}
          clickData={emailInviteModalVisible}
        />
      ) : null}
    </Stack>
  ) : null;
};

export default OrganizerResponseRow;
