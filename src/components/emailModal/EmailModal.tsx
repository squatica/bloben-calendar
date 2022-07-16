import {
  Flex,
  FormLabel,
  IconButton,
  InputGroup,
  Spacer,
  Text,
} from '@chakra-ui/react';
import { filter } from 'lodash';
import ChakraInput from '../chakraCustom/ChakraInput';
import ChakraTextArea from '../chakraCustom/ChakraTextArea';
import CrossIcon from '../eva-icons/cross';
import ModalNew from '../modalNew/ModalNew';
import PrimaryButton from '../chakraCustom/primaryButton/PrimaryButton';
import React, { useEffect, useState } from 'react';
import ResizeTextarea from 'react-textarea-autosize';
import Separator from '../separator/Separator';

interface EmailModalModalProps {
  handleClose: any;
  handleSend: (text: string, recipients: string[]) => void;
  initialText?: string;
}
const EmailModal = (props: EmailModalModalProps) => {
  const { handleClose, initialText, handleSend } = props;
  const [text, setText] = useState<string>('');
  const [recipients, setRecipients] = useState<string[]>([]);
  const [recipient, setRecipient] = useState<string>('');

  useEffect(() => {
    if (initialText) {
      setText(initialText);
    }
  }, []);

  const handleClick = async () => {
    await handleSend(text, recipients);
  };

  const handleAddRecipient = () => {
    if (recipient?.length) {
      const recipientsNew = [...recipients, recipient];

      setRecipients(recipientsNew);
      setRecipient('');
    }
  };
  const removeRecipient = (item: string) => {
    const recipientsNew = filter(recipients, (recipient) => recipient !== item);
    setRecipients(recipientsNew);
  };

  const onKeyPress = (e: any) => {
    if (e.key === 'Enter') {
      handleAddRecipient();
    }
  };

  return (
    <ModalNew
      handleClose={handleClose}
      closeButton={true}
      width={600}
      footer={
        <Flex direction={'row'} style={{ marginTop: 2 }}>
          <Spacer />
          <PrimaryButton isSecondary={true} onClick={handleClose}>
            {'Cancel'}
          </PrimaryButton>
          <Separator width={50} />
          <PrimaryButton onClick={handleClick}>Send email</PrimaryButton>
        </Flex>
      }
    >
      <Flex direction={'column'} alignItems={'flex-start'}>
        <FormLabel htmlFor="recipient">Add recipient</FormLabel>
        <InputGroup size={'md'}>
          <ChakraInput
            name={'recipient'}
            value={recipient}
            type={'text'}
            onKeyPress={onKeyPress}
            onChange={(e: any) => {
              setRecipient(e.target.value);
            }}
          />
        </InputGroup>

        {recipients.length ? (
          <Flex
            direction={'column'}
            style={{ marginLeft: 8, width: '100%', marginRight: 16 }}
          >
            <Separator height={20} />
            <FormLabel htmlFor="recipient">Recipients</FormLabel>
            {recipients.map((item) => {
              return (
                <Flex direction={'row'} key={item}>
                  <Text>{item}</Text>
                  <Spacer />
                  <IconButton
                    _focus={{ boxShadow: 'none' }}
                    variant={'ghost'}
                    aria-label="Remove recipient"
                    background={'transparent'}
                    icon={<CrossIcon className={'AttendeeIcon'} />}
                    isRound
                    size={'xs'}
                    autoFocus={false}
                    onClick={() => removeRecipient(item)}
                  />
                </Flex>
              );
            })}
          </Flex>
        ) : null}

        <Separator height={30} />

        <FormLabel htmlFor="recipient">Email body</FormLabel>
        <ChakraTextArea
          size={'md'}
          placeholder="Email body"
          name={'text'}
          value={text || ''}
          variant={'outline'}
          onChange={(e: any) => setText(e.target.value)}
          autoComplete={'off'}
          minRows={4}
          rows={4}
          maxRows={10}
          as={ResizeTextarea}
        />
      </Flex>
    </ModalNew>
  );
};

export default EmailModal;
