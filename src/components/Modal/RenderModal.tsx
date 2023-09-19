import { PropsWithChildren, useLayoutEffect, useState } from 'react';
import { createPortal } from 'react-dom';

type RenderModalProps = PropsWithChildren<{
  wrapperId?: string;
}>;
export const RenderModal = (props: RenderModalProps) => {
  const { children, wrapperId } = props;

  //if (wrapperId === '') throw new Error('wrapperId is required and cannot be empty');
  const wrapperIdDefault = 'modal-wrapper';

  const [wrapperElement, setWrapperElement] = useState<HTMLElement | null>(null);

  const createModalWrapper = (wrapperId: string) => {
    const wrapperElement = document.createElement('div');
    wrapperElement.setAttribute('id', wrapperId);
    document.body.appendChild(wrapperElement);
    return wrapperElement;
  };

  useLayoutEffect(() => {
    let wrapperIdName = wrapperId ? wrapperId : wrapperIdDefault;
    let element = document.getElementById(wrapperIdName);
    let systemCreated = false;

    if (!element) {
      systemCreated = true;
      element = createModalWrapper(wrapperIdName);
    }
    setWrapperElement(element);

    return () => {
      if (systemCreated && element !== null && element.parentNode) {
        element.parentNode.removeChild(element);
      }
    };
  }, [wrapperId]);

  if (wrapperElement === null) return null;

  return createPortal(children, wrapperElement);
};
