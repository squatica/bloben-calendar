/* eslint-disable react/no-children-prop */
import React, { useContext } from 'react';

import { Context } from '../../../context/store';
import { EvaIcons } from 'components/eva-icons';
import { Input, Stack } from '@chakra-ui/react';
import FormIcon from '../../formIcon/FormIcon';

interface EventDetailTitleProps {
  isNewEvent: boolean;
  value: string;
  handleChange?: any;
  disabled?: boolean;
}
const EventDetailTitle = (props: EventDetailTitleProps) => {
  const { isNewEvent, value, handleChange, disabled } = props;

  const [store] = useContext(Context);
  const { isDark } = store;

  return (
    <Stack direction={'row'} align={'center'} style={{ width: '90%' }}>
      <FormIcon isDark={isDark} hidden allVisible>
        <EvaIcons.Note color={'transparent'} fill={'transparent'} />
      </FormIcon>
      <Input
        size={'md'}
        type="text"
        placeholder="Event title"
        name={'summary'}
        value={value}
        variant={disabled ? 'unstyled' : 'outline'}
        fontWeight={'bold'}
        onChange={handleChange}
        readOnly={disabled}
        autoFocus={isNewEvent}
        autoComplete={'off'}
        style={{ width: '95%' }}
      />
    </Stack>
    // <FormContainer>
    //   <FormRow>
    //     <FormInputWrapper>
    //       <FormIcon isDark={isDark} hidden allVisible>
    //         <EvaIcons.Calendar />
    //       </FormIcon>
    //       <FormInput
    //         isDark={isDark}
    //         autoFocus={isNewEvent}
    //         value={value}
    //         type={'big'}
    //         name={'summary'}
    //         multiline={true}
    //         placeholder={'New event'}
    //         handleChange={handleChange}
    //         disabled={disabled}
    //         transparent
    //       />
    //     </FormInputWrapper>
    //   </FormRow>
    // </FormContainer>
  );
};

export default EventDetailTitle;
