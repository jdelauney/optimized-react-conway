import { PropsWithChildren } from 'react';
import { createPortal } from 'react-dom';

export const RenderModal = (props: PropsWithChildren<{}>) => {
  const { children } = props;

  return createPortal(children, document.getElementById('modal-root')!);
};
