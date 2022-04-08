import './Modal.scss';
import { useEffect, useLayoutEffect, useState } from 'react';

interface ModalProps {
  e: any;
  children: any;
  handleClose: any;
  maxHeight?: string;
  width?: number;
  noOverflow?: boolean;
}
const Modal = (props: ModalProps) => {
  const { e, handleClose, noOverflow } = props;
  const [isVisible, setVisible] = useState(false);
  const [layout, setLayout] = useState<any>({ x: null, y: null });

  useEffect(() => {
    const { x, y } = e.nativeEvent;

    setLayout({ x, y });
    setVisible(true);
  }, []);

  const getStyle = () => {
    if (layout.x) {
      return {
        left: layout.x,
        top: layout.y,
        maxWidth: '50%',
        maxHeight: props.maxHeight || '60%',
        minWidth: 300,
        height: 'auto',
        width: props.width ? props.width : 'auto',
        overflowX: 'hidden',
        overflowY: noOverflow ? 'hidden' : 'auto',
      };
    }
  };

  // Correct layout
  useLayoutEffect(() => {
    if (isVisible) {
      const element: any = document.getElementById('Modal__container');
      if (element) {
        let newX = layout.x;
        let newY = layout.y;

        if (element.offsetHeight + layout.y > window.innerHeight) {
          newY = layout.y - element.offsetHeight;

          // fix overflowing to negative top value
          if (newY < 0) {
            newY = newY + newY * -1 + 24;
          }
        }

        if (element.offsetWidth + layout.x > window.innerWidth) {
          newX = layout.x - element.offsetWidth;
        }

        setLayout({
          x: newX,
          y: newY,
        });
      }
    }
  }, [isVisible, document.getElementsByClassName('Modal__container')]);

  const style: any = getStyle();

  const preventDefault = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div className={'Modal__backdrop'} onClick={handleClose}>
      {layout.x && layout.y ? (
        <div
          className={'Modal__container'}
          onClick={preventDefault}
          id="Modal__container"
          style={style}
        >
          {props.children}
        </div>
      ) : null}
    </div>
  );
};

export default Modal;
