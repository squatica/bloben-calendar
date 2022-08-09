import { ACCOUNT_TYPE } from '../../types/enums';
import { Box, Button, Heading, SimpleGrid } from '@chakra-ui/react';
import ModalNew from '../modalNew/ModalNew';

interface AccountSelectionModalProps {
  isOpen: boolean;
  handleClose: any;
  handleOpenNewAccountModal: (type: ACCOUNT_TYPE) => void;
}
const AccountSelectionModal = (props: AccountSelectionModalProps) => {
  return props.isOpen ? (
    <ModalNew handleClose={props.handleClose}>
      <SimpleGrid columns={2} spacing={10}>
        <Box height="80px">
          <Button
            _focus={{ boxShadow: 'none' }}
            height={'100%'}
            width={'100%'}
            justifyContent={'center'}
            onClick={() =>
              props.handleOpenNewAccountModal(ACCOUNT_TYPE.CAL_DAV)
            }
          >
            <Heading size={'lg'}>Dav</Heading>
          </Button>
        </Box>
        <Box height="80px">
          <Button
            _focus={{ boxShadow: 'none' }}
            height={'100%'}
            width={'100%'}
            justifyContent={'center'}
            onClick={() => props.handleOpenNewAccountModal(ACCOUNT_TYPE.WEBCAL)}
          >
            <Heading size={'lg'}>Webcal</Heading>
          </Button>
        </Box>
      </SimpleGrid>
    </ModalNew>
  ) : null;
};

export default AccountSelectionModal;
