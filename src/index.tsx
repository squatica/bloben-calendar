import './index.scss';
import 'typeface-poppins';
import * as serviceWorker from './serviceWorker';
import { ColorModeScript } from '@chakra-ui/react';
import { createRoot } from 'react-dom/client';
import App from './App';
import React from 'react';
import theme from './theme';

declare global {
  interface Window {
    env: {
      apiUrl: string;
    };
  }
}
declare const window: any;

window.env = {};

const container = document.getElementById('root');
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const root = createRoot(container!);

// disable strict mode because of rerenders
root.render(
  <>
    <ColorModeScript initialColorMode={theme.config.initialColorMode} />
    <App />
  </>
);

serviceWorker.register();
