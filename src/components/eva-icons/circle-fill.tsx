import React from 'react';

const CircleFill = (props: any) => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 16 16"
    className={`bi bi-circle-fill ${props.className}`}
    fill={props.fill ? props.fill : 'currentColor'}
    style={props.style}
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="8" cy="8" r="8" />
  </svg>
);

export default CircleFill;
