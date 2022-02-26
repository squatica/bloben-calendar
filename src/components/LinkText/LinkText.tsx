import React from 'react';

import './LinkText.scss';

interface LinkText {
  href: string;
  type?: string;
  text: string;
}

const LinkText = (props: LinkText) => {
  const { href, type, text } = props;

  return (
    <a
      className={`LinkText${type ? `-${type}` : ''}`}
      target={'_blank'}
      href={href}
      rel="noreferrer"
    >
      {text}
    </a>
  );
};

export default LinkText;
