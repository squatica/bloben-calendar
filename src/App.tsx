import React from 'react';

import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import AppRouter from './pages/Router';
import AuthProvider from './layers/AuthProvider';
import BrowserProvider from './layers/BrowserProvider';
import ContextProvider from 'layers/ContextProvider';
import ReduxProvider from './layers/ReduxProvider';
import SocketioProvider from './layers/SocketioProvider';
import StorageProvider from 'layers/StorageProvider';
import StoreProvider from './context/store';
import ThemeWrapper from './components/themeWrapper/ThemeWrapper';

const theme = extendTheme({
  colors: {
    primary: {
      200: '#EC407AB2',
      400: '#ec407a',
    },
  },
});

const App = () => (
  <ChakraProvider theme={theme}>
    <ThemeWrapper>
      <StoreProvider>
        <StorageProvider>
          <ContextProvider>
            <ReduxProvider>
              <BrowserProvider>
                <AuthProvider>
                  <SocketioProvider>
                    <AppRouter />
                  </SocketioProvider>
                </AuthProvider>
              </BrowserProvider>
            </ReduxProvider>
          </ContextProvider>
        </StorageProvider>
      </StoreProvider>
    </ThemeWrapper>
  </ChakraProvider>
);

export default App;
