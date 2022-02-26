export const parseUidFromPrincipal = (principalPath: string) =>
  principalPath.slice(
    -principalPath.indexOf('principal/uid/') + 'principal/uid/'.length + 1,
    -1
  );

export const getBaseUrl = (url: string) => {
  const initialIndex = url.indexOf('://');

  let urlMain = url;
  if (initialIndex !== -1) {
    urlMain = url.slice(url.indexOf('://') + 3);
  }

  const indexOfSlash = urlMain.indexOf('/');

  if (indexOfSlash !== -1) {
    return urlMain.slice(0, indexOfSlash);
  } else {
    return urlMain;
  }
};

export const getIdFromUrl = (url: string) => {
  let str = url;
  // remove last slash
  const hasEndingSlash = str.slice(url.length - 1, url.length) === '/';

  if (hasEndingSlash) {
    str = str.slice(0, -1);
  }

  const endingWithFileExtension = str.slice(-4, -3) === '.';

  if (endingWithFileExtension) {
    str = str.slice(0, -4);
  }

  const re = /([^/]*)$/g;
  const myArray = str.match(re);

  return myArray?.[0] || '';
};
