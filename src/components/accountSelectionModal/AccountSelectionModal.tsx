import { ACCOUNT_TYPE } from '../../types/enums';
import { Box, Button, Heading, SimpleGrid } from '@chakra-ui/react';
import ChakraModal from '../chakraCustom/ChakraModal';

interface AccountSelectionModalProps {
  isOpen: boolean;
  handleClose: any;
  handleOpenNewAccountModal: (type: ACCOUNT_TYPE) => void;
}
const AccountSelectionModal = (props: AccountSelectionModalProps) => {
  return (
    <ChakraModal handleClose={props.handleClose} isOpen={props.isOpen}>
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
            <Heading size={'lg'}>Caldav</Heading>
          </Button>
        </Box>
      </SimpleGrid>
    </ChakraModal>
  );
};

export default AccountSelectionModal;
