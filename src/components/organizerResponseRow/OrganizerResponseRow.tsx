import { ATTENDEE_PARTSTAT } from '../../bloben-interface/enums';
import { Button, Stack, useToast } from '@chakra-ui/react';
import { TOAST_STATUS } from '../../types/enums';
import { createToast } from '../../utils/common';
import { find } from 'lodash';
import CalDavEventsApi from '../../api/CalDavEventsApi';

interface OrganizerResponseRowProps {
  event: any;
  handleClose: any;
}
const OrganizerResponseRow = (props: OrganizerResponseRowProps) => {
  const { event, handleClose } = props;
  const toast = useToast();

  const organizer = find(
    event?.attendees,
    (item) => item.mailto === event.organizer.mailto
  );

  const partStat: ATTENDEE_PARTSTAT | undefined = organizer?.PARTSTAT;

  const updateStatus = async (status: ATTENDEE_PARTSTAT) => {
    if (partStat === status) {
      return;
    }

    try {
      const response = await CalDavEventsApi.updateStatus(event.id, { status });

      if (response.data?.message) {
        toast(createToast(response.data.message));
      }

      handleClose();
    } catch (e: any) {
      toast(createToast(e.response?.data?.message, TOAST_STATUS.ERROR));
    }
  };

  return organizer ? (
    <Stack
      direction={'row'}
      spacing={3}
      justifyContent={'flex-end'}
      style={{ marginTop: 16 }}
    >
      <Button
        variant={partStat === ATTENDEE_PARTSTAT.ACCEPTED ? 'solid' : 'ghost'}
        colorScheme={partStat === ATTENDEE_PARTSTAT.ACCEPTED ? 'pink' : 'gray'}
        onClick={() => updateStatus(ATTENDEE_PARTSTAT.ACCEPTED)}
      >
        Going
      </Button>
      <Button
        variant={partStat === ATTENDEE_PARTSTAT.TENTATIVE ? 'solid' : 'ghost'}
        colorScheme={partStat === ATTENDEE_PARTSTAT.TENTATIVE ? 'pink' : 'gray'}
        onClick={() => updateStatus(ATTENDEE_PARTSTAT.TENTATIVE)}
      >
        Maybe
      </Button>
      <Button
        variant={partStat === ATTENDEE_PARTSTAT.DECLINED ? 'solid' : 'ghost'}
        colorScheme={partStat === ATTENDEE_PARTSTAT.DECLINED ? 'pink' : 'gray'}
        onClick={() => updateStatus(ATTENDEE_PARTSTAT.DECLINED)}
      >
        No
      </Button>
    </Stack>
  ) : null;
};

export default OrganizerResponseRow;
