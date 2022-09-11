import {
  Button,
  Center,
  FormControl,
  FormLabel,
  useToast,
} from '@chakra-ui/react';
import { createToast } from '../../utils/common';

import { ChakraInput, Separator } from 'bloben-components';
import { TOAST_STATUS } from '../../types/enums';
import CardDavContactApi from '../../api/CardDavContactApi';
import ModalNew from '../../components/modalNew/ModalNew';
import React, { useState } from 'react';

interface AddContactModalProps {
  handleClose: any;
  addressBookID: string;
  loadContacts: any;
}
const AddContactModal = (props: AddContactModalProps) => {
  const toast = useToast();

  const [isLoading, setIsLoading] = useState(false);

  const { handleClose, addressBookID, loadContacts } = props;

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');

  const onChange = (e: any): void => {
    const value = e.target.value;

    if (e.target.name === 'email') {
      setEmail(value);
    } else if (e.target.name === 'fullName') {
      setFullName(value);
    }
  };

  const saveContact = async () => {
    if (!addressBookID) {
      toast(createToast('Missing address book id', TOAST_STATUS.ERROR));
      handleClose();
      return;
    }
    setIsLoading(true);
    try {
      const response: any = await CardDavContactApi.create({
        fullName,
        email,
        addressBookID,
      });

      if (response.data?.message) {
        toast(createToast(response.data.message));
      }

      setIsLoading(false);

      await loadContacts();

      handleClose();
    } catch (e: any) {
      toast(createToast(e.response?.data?.message, TOAST_STATUS.ERROR));
      setIsLoading(false);
    }
  };

  return (
    <ModalNew
      handleClose={handleClose}
      title={'Create contact'}
      closeButton={true}
      preventCloseOnBackdrop={true}
    >
      <>
        <FormControl>
          <FormLabel htmlFor="fullName">Name</FormLabel>
          <ChakraInput
            size={'lg'}
            id="fullName"
            type="text"
            name={'fullName'}
            onChange={onChange}
            value={fullName}
          />
        </FormControl>
        <Separator height={18} />
        <FormControl>
          <FormLabel htmlFor="email">Email</FormLabel>
          <ChakraInput
            size={'lg'}
            id="email"
            type="text"
            name={'email'}
            onChange={onChange}
            value={email}
          />
        </FormControl>
        <Separator height={25} />
        <Center>
          <Button
            _focus={{ boxShadow: 'none' }}
            colorScheme={'pink'}
            isLoading={isLoading}
            onClick={saveContact}
          >
            Save
          </Button>
        </Center>
        <Separator height={15} />
      </>
    </ModalNew>
  );
};

export default AddContactModal;
