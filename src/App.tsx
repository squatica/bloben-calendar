import React from 'react';

import {
  ChakraProvider,
  ComponentStyleConfig,
  extendTheme,
} from '@chakra-ui/react';
import AppRouter from './pages/Router';
import AuthProvider from './layers/AuthProvider';
import BrowserProvider from './layers/BrowserProvider';
import ContextProvider from 'layers/ContextProvider';
import ReduxProvider from './layers/ReduxProvider';
import SocketioProvider from './layers/SocketioProvider';
import StorageProvider from 'layers/StorageProvider';
import StoreProvider from './context/store';
import ThemeWrapper from './components/themeWrapper/ThemeWrapper';

const Input: ComponentStyleConfig = {
  baseStyle: {
    focusBorderColor: 'gray.700',
  },
  defaultProps: {
    size: 'lg',
    focusBorderColor: 'gray.700',
  },
};

const Button: ComponentStyleConfig = {
  baseStyle: {
    fontWeight: 'semibold',
    borderRadius: 'base',
    _focus: { boxShadow: 'none' },
  },
  defaultProps: {
    size: 'md',
    variant: 'solid',
    _focus: { boxShadow: 'none' },
  },
};

const theme = extendTheme({
  components: {
    Button,
    Input,
  },
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
