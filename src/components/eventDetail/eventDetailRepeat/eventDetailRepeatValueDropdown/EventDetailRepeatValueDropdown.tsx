import { Context, StoreContext } from '../../../../context/store';
import React, { useContext } from 'react';

import '../../EventDetail.scss';
import { parseCssDark } from '../../../../utils/common';
import ButtonBase from '../../../button/buttonBase/ButtonBase';

interface EditEventRepeatValueDropdownProps {
  isOpen: any;
  label?: string;
  handleOpen: any;
  handleClose: any;
  handleSelect: any;
  value: any;
  values: any;
  style: any;
}
export const EditEventRepeatValueDropdown = (
  props: EditEventRepeatValueDropdownProps
) => {
  const { label, handleOpen, value, style } = props;

  const [store]: [StoreContext] = useContext(Context);

  const { isDark } = store;

  return (
    <div className={'repeat__value-wrapper'}>
      <p className={parseCssDark('EditEventCustomMenu__label', isDark)}>
        {label}
      </p>
      <ButtonBase
        isDark={isDark}
        className={'repeat__value-container'}
        style={style}
        onClick={handleOpen}
      >
        <p className={parseCssDark('repeat__value-text', isDark)}>{value}</p>
        {/*<Dropdown*/}
        {/*  isOpen={isOpen}*/}
        {/*  handleClose={handleClose}*/}
        {/*  selectedValue={value}*/}
        {/*  values={values}*/}
        {/*  onClick={handleSelect}*/}
        {/*  variant={'simple'}*/}
        {/*  isDark={isDark}*/}
        {/*/>*/}
      </ButtonBase>
    </div>
  );
};

export default EditEventRepeatValueDropdown;
