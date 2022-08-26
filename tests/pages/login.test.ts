import { handleLogin } from '../../src/pages/login/loginHelper';
import { mockUserApi } from '../mocks/api/UserApi';
import assert from 'assert';

describe(`[PAGES] Login`, function () {
  before(() => {
    mockUserApi();
  });

  it('Should login with correct password', async () => {
    let contextResult: any;
    let useStateLoading: any;

    const setContextResult = (key: any, value: any) => {
      contextResult = {
        key,
        value,
      };
    };

    const setUseStateMock = (value: any) => {
      useStateLoading = value;
    };

    await handleLogin(
      'tester',
      'pass123',
      setUseStateMock,
      setContextResult,
      () => {
        return null;
      }
    );

    assert.equal(useStateLoading, false);
    assert.equal(contextResult.key, 'isLogged');
    assert.equal(contextResult.value, true);
  });

  it('Should fail with wrong password', async () => {
    let contextResult: any;
    let useStateLoading: any;
    let toastResult: any;

    const setContextResult = (key: any, value: any) => {
      contextResult = {
        key,
        value,
      };
    };

    const setUseStateMock = (value: any) => {
      useStateLoading = value;
    };

    const setToastResult = (value: any) => {
      toastResult = value;
    };

    await handleLogin(
      'tester',
      'aaaaa',
      setUseStateMock,
      setContextResult,
      setToastResult
    );

    assert.equal(useStateLoading, false);
    assert.equal(toastResult.title, 'Fail');
    assert.equal(contextResult.key, 'isLogged');
    assert.equal(contextResult.value, false);
  });
});
