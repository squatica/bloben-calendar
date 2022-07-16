import { Route, Routes } from 'react-router-dom';
import AuthProvider from './AuthProvider';
import NotFoundPage from '../pages/NotFound';
import Public from '../pages/Public';
import React from 'react';

const RouterProvider = () => {
  return (
    <Routes>
      <Route path={'/calendar/public/:id'} element={<Public />} />
      <Route path={'/calendar/404'} element={<NotFoundPage />} />
      <Route path={'/calendar'} element={<AuthProvider />} />
    </Routes>
  );
};

export default RouterProvider;
