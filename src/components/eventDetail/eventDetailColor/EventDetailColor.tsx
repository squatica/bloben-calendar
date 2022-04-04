import {
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stack,
} from '@chakra-ui/react';
import { EvaIcons } from '../../eva-icons';
import { colors } from '../../../utils/colors';
import CircleFill from '../../eva-icons/circle-fill';
import FormIcon from '../../formIcon/FormIcon';
import React from 'react';
import Separator from '../../separator/Separator';

interface EventDetailColorProps {
  color?: string;
  setForm: any;
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const EventDetailColor = (props: EventDetailColorProps) => {
  return (
    <Stack direction={'row'} align={'center'}>
      <FormIcon isDark={false} allVisible hidden>
        <EvaIcons.Pin className={'EventDetail-icon'} />
      </FormIcon>
      <Menu isLazy>
        <MenuButton
          style={{ background: props.color, color: 'white' }}
          as={Button}
        >
          {props.color}
        </MenuButton>
        <MenuList
          style={{ maxHeight: 120, overflowX: 'hidden', overflowY: 'scroll' }}
        >
          {colors.map((item) => {
            return (
              <MenuItem key={item} onClick={() => props.setForm('color', item)}>
                <CircleFill fill={item} />
                <Separator width={8} />
                {item}
              </MenuItem>
            );
          })}
        </MenuList>
      </Menu>
    </Stack>
  );
};

export default EventDetailColor;
