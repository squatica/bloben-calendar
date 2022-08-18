import { Context } from '../../context/store';
import { Input, InputProps } from '@chakra-ui/react';
import React, { useContext } from 'react';

interface ChakraInputProps extends InputProps {
  variant?: string;
  disabled?: boolean;
  readOnly?: boolean;
  ref?: any;
  width?: number;
  onKeyPress?: any;
}
const ChakraInput = (props: ChakraInputProps) => {
  const [store] = useContext(Context);
  const { isDark } = store;

  const {
    ref,
    disabled,
    onChange,
    name,
    value,
    placeholder,
    type,
    variant,
    autoComplete,
    autoFocus,
    style,
    fontWeight,
    readOnly,
    size,
    width,
    onKeyPress,
    maxLength,
    onBlur,
    className,
    onFocus,
  } = props;

  return (
    <Input
      ref={ref}
      size={size || 'md'}
      type={type || 'text'}
      color={isDark ? 'gray.100' : 'gray.900'}
      placeholder={placeholder || ''}
      borderColor={isDark ? 'gray.600' : 'gray.400'}
      focusBorderColor={isDark ? 'gray.200' : 'gray.700'}
      _placeholder={{
        color: isDark ? 'gray.400' : 'gray.500',
      }}
      className={className}
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
      width={width}
      onKeyPress={onKeyPress}
      maxLength={maxLength}
      onBlur={onBlur}
      onFocus={onFocus}
    />
  );
};

export default ChakraInput;
