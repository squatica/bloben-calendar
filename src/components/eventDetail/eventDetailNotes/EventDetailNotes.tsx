import React, { useContext } from 'react';

import { Context } from '../../../context/store';
import { EvaIcons } from 'components/eva-icons';
import { Stack, Textarea } from '@chakra-ui/react';
import { parseHtml } from '../../../utils/parserHtml';
import FormIcon from '../../formIcon/FormIcon';
import ResizeTextarea from 'react-textarea-autosize';

interface EventDetailNotesProps {
  handleChange?: any;
  value: string;
  disabled?: boolean;
}
const EventDetailNotes = (props: EventDetailNotesProps) => {
  const { value, handleChange, disabled } = props;

  const [store] = useContext(Context);
  const { isDark } = store;

  return (
    <Stack
      direction={'row'}
      align={'center'}
      style={{
        width: '100%',
      }}
    >
      <FormIcon isDark={isDark} allVisible alignTop>
        <EvaIcons.Document className={'EventDetail-icon'} />
      </FormIcon>
      {disabled ? (
        <p dangerouslySetInnerHTML={{ __html: parseHtml(value) }} />
      ) : (
        <Textarea
          size={'md'}
          placeholder="Notes"
          name={'description'}
          value={value}
          variant={disabled ? 'unstyled' : 'outline'}
          onChange={handleChange}
          isDisabled={disabled}
          autoComplete={'off'}
          minRows={1}
          rows={1}
          maxRows={5}
          as={ResizeTextarea}
          focusBorderColor={'gray.700'}
        />
      )}
    </Stack>
  );
};

export default EventDetailNotes;
