import React, { useContext, useEffect, useState } from 'react';

import { Context } from '../../../context/store';
import { EvaIcons } from 'components/eva-icons';
import { Stack, Textarea } from '@chakra-ui/react';
import { parseHtml } from '../../../utils/parserHtml';
import { parseLinkInText } from '../../../utils/common';
import FormIcon from '../../formIcon/FormIcon';

// const renderTextWithLinks = (data: any) => {
//   if (!data || (data && data.length === 0)) {
//     return null;
//   }
//
//   return data.map((item: any, index: number) => {
//     if (item.type === 'link') {
//       return (
//         <a
//           key={index}
//           href={item.value}
//           className={'link'}
//           target={'_blank'}
//           rel="noopener noreferrer"
//         >
//           {item.value}
//         </a>
//       );
//     } else {
//       return <span key={index}>{item.value}</span>;
//     }
//   });
// };

interface EventDetailNotesProps {
  handleChange?: any;
  value: string;
  disabled?: boolean;
}
const EventDetailNotes = (props: EventDetailNotesProps) => {
  const { value, handleChange, disabled } = props;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [textParsed, setTextParsed] = useState(null);
  const [store] = useContext(Context);
  const { isDark } = store;

  useEffect(() => {
    const test: any = parseLinkInText(value);
    setTextParsed(test);
  }, []);

  // const links: any = textParsed ? renderTextWithLinks(textParsed) : null;

  return (
    <Stack direction={'row'} align={'center'} width={'auto'} height={'100%'}>
      <FormIcon isDark={isDark} allVisible alignTop>
        <EvaIcons.Document className={'EventDetail-icon'} />
      </FormIcon>
      {disabled ? (
        <p dangerouslySetInnerHTML={{ __html: parseHtml(value) }} />
      ) : (
        <Textarea
          size={'lg'}
          placeholder="Notes"
          name={'description'}
          value={value}
          variant={disabled ? 'unstyled' : 'outline'}
          onChange={handleChange}
          isDisabled={disabled}
          height={50}
        />
      )}
    </Stack>
    // <FormContainer>
    //   <FormRow>
    //     <FormIcon isDark={isDark} allVisible>
    //       <EvaIcons.Document />
    //     </FormIcon>
    //     <FormInputWrapper>
    //       {!disabled ? (
    //         <FormInput
    //           isDark={isDark}
    //           value={value}
    //           name={'description'}
    //           multiline={true}
    //           placeholder={'Notes'}
    //           handleChange={handleChange}
    //           disabled={disabled}
    //           type={disabled ? 'normal-transparent' : 'normal'}
    //         />
    //       ) : (
    //         <FormText isDark={isDark} text={links} />
    //       )}
    //     </FormInputWrapper>
    //   </FormRow>
    // </FormContainer>
  );
};

export default EventDetailNotes;
