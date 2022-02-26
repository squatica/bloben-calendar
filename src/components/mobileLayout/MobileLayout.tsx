import { Context } from '../../context/store';
import { useContext } from 'react';

interface MobileLayoutProps {
  children: any;
}
const MobileLayout = (props: MobileLayoutProps) => {
  const { children } = props;

  const [store] = useContext(Context);
  const { isMobile } = store;

  return isMobile ? children : null;
};

export default MobileLayout;
