import { checkLogin } from '../../src/layers/authProvider/authProviderHelper';
import { mockProfileApi, mockProfileApiFail } from '../mocks/api/ProfileApi';
import { mockUserApi } from '../mocks/api/UserApi';
import assert from 'assert';

describe(`[LAYERS] AuthProvider`, function () {
  it('Should set logged off with no api url', async () => {
    // @ts-ignore
    global.window.env = {};
    let contextResult1: any;
    let contextResult2: any;

    const setContextResult = (key: any, value: any) => {
      if (key === 'isLogged') {
        contextResult1 = {
          key,
          value,
        };
      } else {
        contextResult2 = {
          key,
          value,
        };
      }
    };
    await checkLogin(
      setContextResult,
      () => {
        return null;
      },
      () => {
        return null;
      }
    );

    assert.equal(contextResult1.key, 'isLogged');
    assert.equal(contextResult2.key, 'isAppStarting');
    assert.equal(contextResult1.value, false);
    assert.equal(contextResult2.value, false);
  });

  it('Should handle failed authenticated status', async () => {
    mockProfileApiFail();

    // @ts-ignore
    global.window.env.apiUrl = 'http://localhost';
    let contextResult1: any;
    let contextResult2: any;

    const setContextResult = (key: any, value: any) => {
      if (key === 'isLogged') {
        contextResult1 = {
          key,
          value,
        };
      } else {
        contextResult2 = {
          key,
          value,
        };
      }
    };
    await checkLogin(
      setContextResult,
      () => {
        return null;
      },
      () => {
        return null;
      }
    );

    assert.equal(contextResult1.key, 'isLogged');
    assert.equal(contextResult2.key, 'isAppStarting');
    assert.equal(contextResult1.value, false);
    assert.equal(contextResult2.value, false);
  });

  it('Should handle successful authenticated status', async () => {
    mockUserApi();
    mockProfileApi();

    // @ts-ignore
    global.window.env.apiUrl = 'http://localhost';
    let contextResult1: any;
    let contextResult2: any;
    let reduxDispatchResult: any;

    const setContextResult = (key: any, value: any) => {
      if (key === 'isLogged') {
        contextResult1 = {
          key,
          value,
        };
      } else {
        contextResult2 = {
          key,
          value,
        };
      }
    };

    const handleReduxDispatch = (data: any) => {
      reduxDispatchResult = data;
    };

    await checkLogin(
      setContextResult,
      () => {
        return null;
      },
      handleReduxDispatch
    );

    assert.equal(contextResult1.key, 'isLogged');
    assert.equal(contextResult2.key, 'isAppStarting');
    assert.equal(contextResult1.value, true);
    assert.equal(contextResult2.value, false);
    assert.equal(reduxDispatchResult.type, 'SET_USER');
    assert.equal(reduxDispatchResult.payload.id, '12345');
    assert.equal(reduxDispatchResult.payload.username, 'tester');
  });
});
