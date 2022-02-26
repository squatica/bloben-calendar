import { useEffect, useState } from 'react';

const getWidth = () =>
  window.innerWidth ||
  document.documentElement.clientWidth ||
  document.body.clientWidth;

export const useWidth = () => {
  const [width, setWidth] = useState(getWidth());

  // Get width on init
  useEffect(() => {
    const listenToResizeEvent = () => {
      setWidth(getWidth());
    };

    window.addEventListener('resize', listenToResizeEvent);

    return () => {
      window.removeEventListener('resize', listenToResizeEvent);
    };
  }, []);

  return width;
};

const getHeight = () =>
  window.innerHeight ||
  document.body.clientHeight ||
  document.documentElement.clientHeight;

/**
 * Get height on resize
 */
export const useHeight = () => {
  const [height, setHeight] = useState(getHeight());

  // Get height on init
  useEffect(() => {
    getHeight();
  }, []);

  useEffect(() => {
    const listenToResizeEvent = () => {
      setHeight(getHeight());
    };

    window.addEventListener('resize', listenToResizeEvent);

    return () => {
      window.removeEventListener('resize', listenToResizeEvent);
    };
  }, []);

  return height;
};
