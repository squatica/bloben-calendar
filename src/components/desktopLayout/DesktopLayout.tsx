import { Context } from '../../context/store';
import { useContext } from 'react';

interface DesktopLayoutProps {
  children: any;
}
const DesktopLayout = (props: DesktopLayoutProps) => {
  const { children } = props;

  const [store] = useContext(Context);
  const { isMobile } = store;

  return !isMobile ? children : null;
};

export default DesktopLayout;
