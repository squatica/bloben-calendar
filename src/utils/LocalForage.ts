import localForage from 'localforage';

export const LocalForage = localForage.createInstance({
  name: 'database',
  version: 1,
  storeName: 'storage',
});

LocalForage.setDriver(localForage.INDEXEDDB)
  .then(() => {
    return;
  })
  .catch((error) => {
    if (process.env.NODE_ENV !== 'test') {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  });

export default LocalForage;
