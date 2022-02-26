import { useEffect } from 'react';

const DemoPage = () => {
  const demoDomain = 'https://demo.bloben.com/api';
  useEffect(() => {
    window.localStorage.setItem('apiUrl', demoDomain);
    window.env.apiUrl = demoDomain;
    window.location.replace('/calendar');
  }, []);

  return <div />;
};

export default DemoPage;
