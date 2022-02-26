import { useEffect } from 'react';

const EmptyPage = () => {
  useEffect(() => {
    window.location.assign('/calendar');
  }, []);

  return <div />;
};

export default EmptyPage;
