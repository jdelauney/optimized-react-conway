import { PropsWithChildren, useEffect, useRef } from 'react';
import { Button } from '../ui/Button/Button';

type ModalDialogProps = PropsWithChildren<{
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  hasTopCloseButton?: boolean;
  hasHeader?: boolean;
  hasFooter?: boolean;
  hasFooterCloseButton?: boolean;
  hasFooterActionButton?: boolean;
  actionButtonText?: string;
  closeButtonText?: string;
  title?: string;
  attachedFormId?: string;
  onAction?: () => void;
  onClose?: () => void;
}>;

const ModalButtonClose = (props: PropsWithChildren<{ onClose: () => void }>) => {
  return (
    <button className='flex items-center justify-center mt-1 text-lg hover:text-red-400' onClick={props.onClose}>
      <svg
        stroke='currentColor'
        fill='currentColor'
        strokeWidth={0}
        viewBox='0 0 1024 1024'
        height='1em'
        width='1em'
        {...props}
      >
        <path d='M685.4 354.8c0-4.4-3.6-8-8-8l-66 .3L512 465.6l-99.3-118.4-66.1-.3c-4.4 0-8 3.5-8 8 0 1.9.7 3.7 1.9 5.2l130.1 155L340.5 670a8.32 8.32 0 0 0-1.9 5.2c0 4.4 3.6 8 8 8l66.1-.3L512 564.4l99.3 118.4 66 .3c4.4 0 8-3.5 8-8 0-1.9-.7-3.7-1.9-5.2L553.5 515l130.1-155c1.2-1.4 1.8-3.3 1.8-5.2z' />
        <path d='M512 65C264.6 65 64 265.6 64 513s200.6 448 448 448 448-200.6 448-448S759.4 65 512 65zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z' />
      </svg>
    </button>
  );
};
const ModalDialogHeader = (props: PropsWithChildren<{ title: string }>) => {
  return (
    <header className='pl-4 pr-2 pt-2 pb-3 flex justify-between items-center border-b-2 border-slate-600 bg-slate-800 mb-2'>
      <h2 className='text-xl leading-none font-bold text-slate-300'>{props.title}</h2>
      {props.children}
    </header>
  );
};

const ModalDialogFooter = (props: PropsWithChildren) => {
  return (
    <footer className='px-2 py-2 flex justify-end gap-3 items-center border-t-2 border-slate-600 bg-slate-800 mt-2'>
      {props.children}
    </footer>
  );
};

export const ModalDialog = (props: ModalDialogProps) => {
  const {
    children,
    isOpen,
    setIsOpen,
    hasTopCloseButton,
    hasHeader,
    title,
    hasFooter,
    hasFooterCloseButton,
    hasFooterActionButton,
    actionButtonText,
    closeButtonText,
    attachedFormId,
    onAction,
    onClose,
  } = props;

  const modalDialogRef = useRef<HTMLDialogElement | null>(null);

  const handleCloseModalClick = () => {
    if (onClose) {
      onClose();
    }
    setIsOpen(false);
  };

  const handleActionModalClick = () => {
    if (onAction) {
      onAction();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDialogElement>) => {
    if (event.key === 'Escape') {
      handleCloseModalClick();
    }
  };

  useEffect(() => {
    const modalElement = modalDialogRef.current;
    if (modalElement) {
      if (isOpen) {
        modalElement.showModal();
      } else {
        modalElement.close();
      }
    }
  }, [isOpen]);

  return (
    <dialog
      ref={modalDialogRef}
      onKeyDown={handleKeyDown}
      className='bg-slate-700 text-slate-100 z-10 rounded-md border border-slate-800 backdrop:bg-slate-800 backdrop:bg-opacity-70 open:animate-fade-in open:backdrop:animate-fade-in backdrop:backdrop-blur-sm shadow-lg shadow-slate-900/80'
    >
      {hasHeader ? (
        <ModalDialogHeader title={title ?? 'Boite de dialogue'}>
          {hasTopCloseButton && <ModalButtonClose onClose={handleCloseModalClick} />}
        </ModalDialogHeader>
      ) : (
        hasTopCloseButton && <ModalButtonClose onClose={handleCloseModalClick} />
      )}
      <div className='px-3 py-2'>{children}</div>
      {hasFooter && (
        <ModalDialogFooter>
          {hasFooterActionButton && (
            <Button
              type={attachedFormId ? 'submit' : 'button'}
              form={attachedFormId}
              variant='primary'
              onClick={handleActionModalClick}
            >
              {actionButtonText ?? 'Ok'}
            </Button>
          )}
          {hasFooterCloseButton && (
            <Button variant='accent' onClick={handleCloseModalClick}>
              {closeButtonText ?? 'Annuler'}
            </Button>
          )}
        </ModalDialogFooter>
      )}
    </dialog>
  );
};
