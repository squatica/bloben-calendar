import { ImportMock } from 'ts-mock-imports';
import { reduxStore } from '../../src/layers/ReduxProvider';

export const mockReduxStore = () => {
  const mockManager = ImportMock.mockOther(reduxStore, 'reduxStore', {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getState: () => {
      return {
        calDavCalendars: [],
      };
    },
  });

  return mockManager;
};
