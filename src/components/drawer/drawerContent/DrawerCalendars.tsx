import '../Drawer.scss';
import {
  CalDavAccount,
  CalDavCalendar,
  ReduxState,
} from '../../../types/interface';
import { Context, StoreContext } from '../../../context/store';
import { DRAWER_PATH } from '../../../types/enums';
import { Divider } from '@chakra-ui/react';
import { getAccountCalendars } from '../../../utils/tsdavHelper';
import { getBaseUrl } from '../../../utils/parser';
import { useSelector } from 'react-redux';
import DesktopLayout from '../../desktopLayout/DesktopLayout';
import DrawerItem from '../drawerItem/DrawerItem';
import NewCalDavAccountButton from '../newAccount/NewAccount';
import React, { useContext } from 'react';

const renderAccountCalendars = (
  accountCalendars: CalDavCalendar[],
  path: DRAWER_PATH
) => {
  if (path === DRAWER_PATH.CALENDAR) {
    return accountCalendars
      .filter((item) => item.components?.includes('VEVENT'))
      .map((item) => {
        return <DrawerItem key={item.url} calendar={item} />;
      });
  }
};

const renderCalendars = (
  calendars: CalDavCalendar[],
  isDark: boolean,
  navToCalendarEdit: any,
  calDavAccounts: CalDavAccount[],
  path: DRAWER_PATH
) => {
  return calDavAccounts.map((account) => {
    const accountCalendars = renderAccountCalendars(
      getAccountCalendars(account, calendars),
      path
    );

    return (
      <div
        className={'CalendarDrawer__container-section'}
        key={account.principalUrl}
      >
        <p className={'CalendarDrawer__calendar-title'}>
          {getBaseUrl(account.principalUrl || account.username || '')}
        </p>
        {accountCalendars}
      </div>
    );
  });
};

interface DrawerContentProps {
  path: DRAWER_PATH;
}
const DrawerCalendars = (props: DrawerContentProps) => {
  const [store]: [StoreContext] = useContext(Context);
  const { isDark } = store;

  const calDavAccounts: CalDavAccount[] = useSelector(
    (state: ReduxState) => state.calDavAccounts
  );
  const calDavCalendars: CalDavCalendar[] = useSelector(
    (state: ReduxState) => state.calDavCalendars
  );

  const renderSelected = (path: DRAWER_PATH) => {
    return renderCalendars(
      calDavCalendars,
      isDark,
      () => {
        return;
      },
      calDavAccounts,
      path
    );
  };

  const renderedContent = renderSelected(props.path);

  return (
    <>
      <div className={'CalendarDrawer__container-subtitle'}>
        <DesktopLayout>
          <NewCalDavAccountButton />
        </DesktopLayout>
      </div>
      {renderedContent}
      <Divider />
    </>
  );
};

export default DrawerCalendars;
