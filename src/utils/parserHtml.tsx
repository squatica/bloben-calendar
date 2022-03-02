import sanitizeHtml from 'sanitize-html';

export const parseHtml = (html: string) => {
  // let result: any = html.replaceAll('\\n', '');
  // result = result.replaceAll(';', '');
  // result = result.replaceAll('\\', '');
  // result = result.replaceAll('<b>', '');
  // result = result.replaceAll('</b>', '');
  const clean = sanitizeHtml(html, {
    allowedTags: ['b', 'i', 'em', 'strong', 'a', 'br'],
    allowedAttributes: {
      a: ['href'],
    },
  });

  return clean;
};
