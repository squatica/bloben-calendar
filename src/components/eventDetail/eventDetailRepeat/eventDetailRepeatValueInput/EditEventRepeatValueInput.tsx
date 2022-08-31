import React, { useContext } from 'react';

import '../../EventDetail.scss';
import './EditEventRepeatValueInput.scss';

import { Context, StoreContext } from '../../../../context/store';
import { parseCssDark } from '../../../../utils/common';
import ChakraInput from '../../../chakraCustom/ChakraInput';

interface EditEventRepeatValueInputProps {
  defaultValue?: any;
  type: string;
  name: any;
  onChange: any;
  style: any;
  value: any;
}
const EditEventRepeatValueInput = (props: EditEventRepeatValueInputProps) => {
  const { defaultValue, type, name, value, onChange, style } = props;

  const [store]: [StoreContext] = useContext(Context);
  const { isDark } = store;

  const handleChange = (e: any) => {
    if (!isNaN(e.target.value)) {
      onChange(e);
    }
  };

  return (
    <div className={'EditEventRepeatValueInput__wrapper'}>
      <ChakraInput
        type={type}
        style={style}
        defaultValue={defaultValue}
        min={1}
        name={name}
        className={parseCssDark('EditEventRepeatValueInput__input', isDark)}
        value={value}
        onChange={handleChange}
      />
    </div>
  );
};

export default EditEventRepeatValueInput;
