import { CalDavCalendar, ReduxState } from '../../../types/interface';
import { Context, StoreContext } from '../../../context/store';
import { EvaIcons, SettingsButton } from 'bloben-components';
import { Flex } from '@chakra-ui/react';
import { parseCssDark } from '../../../utils/common';
import { useSelector } from 'react-redux';
import React, { useContext } from 'react';

const renderMenuItems = (
  items: CalDavCalendar[],
  onClick: any,
  selected: string,
  isDark?: boolean
) => {
  return items
    .filter((item) => {
      return item.components.includes('VTODO');
    })
    .map((item) => {
      return (
        <SettingsButton
          key={item.id}
          onClick={() => onClick(item.id)}
          icon={
            <EvaIcons.RadioOn
              className={parseCssDark('SettingsMenu__icon', isDark)}
              style={{ fill: item.color }}
            />
          }
          text={item.displayName}
          path={item.id}
          selected={selected}
        />
      );
    });
};

interface TasksMenuProps {
  onClick: any;
  selected: string;
}
const TasksMenu = (props: TasksMenuProps) => {
  const [store]: [StoreContext, any] = useContext(Context);
  const { isDark } = store;
  const { onClick, selected } = props;

  const calDavCalendars: CalDavCalendar[] = useSelector(
    (state: ReduxState) => state.calDavCalendars
  );

  const menuItems = renderMenuItems(calDavCalendars, onClick, selected, isDark);

  return (
    <Flex direction={'column'}>
      <SettingsButton
        onClick={() => onClick('latest')}
        icon={
          <EvaIcons.RadioOn
            className={parseCssDark('SettingsMenu__icon', isDark)}
          />
        }
        text={'Latest'}
        path={'latest'}
        selected={selected}
      />
      {menuItems}
    </Flex>
  );
};

export default TasksMenu;
