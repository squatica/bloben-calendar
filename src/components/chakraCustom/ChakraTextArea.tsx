import { Context } from '../../context/store';
import { InputProps } from '@chakra-ui/react';
import { Textarea } from '@chakra-ui/react';
import React, { useContext } from 'react';
import ResizeTextarea from 'react-textarea-autosize';

interface ChakraTextAreaProps extends InputProps {
  variant?: string;
  disabled?: boolean;
  readOnly?: boolean;
  onChange: any;
  minRows?: number;
  maxRows?: number;
  rows?: number;
}
const ChakraTextArea = (props: ChakraTextAreaProps) => {
  const [store] = useContext(Context);
  const { isDark } = store;

  const {
    disabled,
    onChange,
    name,
    value,
    placeholder,
    variant,
    autoComplete,
    autoFocus,
    style,
    fontWeight,
    readOnly,
    size,
    minRows,
    maxRows,
    rows,
  } = props;

  return (
    <Textarea
      as={ResizeTextarea}
      size={size || 'md'}
      placeholder={placeholder || ''}
      borderColor={isDark ? 'gray.600' : 'gray.400'}
      focusBorderColor={isDark ? 'gray.200' : 'gray.700'}
      _placeholder={{
        color: isDark ? 'gray.400' : 'gray.500',
      }}
      minRows={minRows}
      rows={rows}
      maxRows={maxRows}
      name={name}
      value={value}
      variant={variant || (disabled ? 'unstyled' : 'outline')}
      fontWeight={fontWeight || 'normal'}
      onChange={onChange}
      disabled={disabled}
      readOnly={readOnly}
      autoFocus={autoFocus}
      autoComplete={autoComplete}
      style={style}
    />
  );
};

export default ChakraTextArea;
