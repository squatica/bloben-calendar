import { Flex, Spacer } from '@chakra-ui/react';
import ChakraTextArea from '../chakraCustom/ChakraTextArea';
import ModalNew from '../modalNew/ModalNew';
import PrimaryButton from '../chakraCustom/primaryButton/PrimaryButton';
import React, { useState } from 'react';
import ResizeTextarea from 'react-textarea-autosize';
import Separator from '../separator/Separator';
import Warning from '../warning/Warning';

interface SendInviteModalProps {
  handleClose: any;
  clickData: any;
  warningText?: string;
}
const SendInviteModal = (props: SendInviteModalProps) => {
  const { handleClose, clickData, warningText } = props;
  const [text, setText] = useState<string | null>(null);

  const handleClick = async (sendInvite?: boolean) => {
    await clickData.call(sendInvite, text);

    handleClose();
  };
  return (
    <ModalNew
      handleClose={handleClose}
      closeButton={true}
      width={400}
      footer={
        <Flex direction={'row'} style={{ marginTop: 2 }}>
          <Spacer />
          <PrimaryButton isSecondary={true} onClick={() => handleClick(false)}>
            {"Don't send email"}
          </PrimaryButton>
          <Separator width={50} />
          <PrimaryButton onClick={() => handleClick(true)}>
            Send email
          </PrimaryButton>
        </Flex>
      }
    >
      <Flex direction={'column'} alignItems={'flex-start'}>
        {warningText ? (
          <>
            <Warning text={warningText} />
            <Separator height={16} />{' '}
          </>
        ) : null}
        <ChakraTextArea
          size={'md'}
          placeholder="Optional email note"
          name={'text'}
          value={text || ''}
          variant={'outline'}
          onChange={(e: any) => setText(e.target.value)}
          autoComplete={'off'}
          minRows={2}
          rows={2}
          maxRows={5}
          as={ResizeTextarea}
        />
      </Flex>
    </ModalNew>
  );
};

export default SendInviteModal;
