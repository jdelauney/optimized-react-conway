import { PropsWithChildren, useEffect, useRef, useState } from 'react';

type ModalDialogProps = PropsWithChildren<{
  isOpen: boolean;
  hasTopCloseButton?: boolean;
  hasHeader?: boolean;
  hasFooter?: boolean;
  hasFooterCloseButton?: boolean;
  hasFooterActionButton?: boolean;
  actionButtonText?: string;
  closeButtonText?: string;
  title?: string;
  onAction?: () => void;
  onClose?: () => void;
}>;

const ModalButtonClose = (props: PropsWithChildren<{ onClose: () => void }>) => {
  return (
    <button className='' onClick={props.onClose}>
      Close
    </button>
  );
};
const ModalDialogHeader = (props: PropsWithChildren<{ title: string }>) => {
  return (
    <header className='px-4 py-2 flex justify-between items-center border-b-2 border-slate-600 bg-slate-800 mb-2'>
      <h2 className='text-xl font-bold text-slate-300'>{props.title}</h2>
      {props.children}
    </header>
  );
};

const ModalDialogFooter = (props: PropsWithChildren<{}>) => {
  return (
    <footer className='px-4 py-2 flex justify-end gap-3 items-center border-t-2 border-slate-600 bg-slate-800 mt-2'>
      {props.children}
    </footer>
  );
};

export const ModalDialog = (props: ModalDialogProps) => {
  const {
    children,
    isOpen,
    hasTopCloseButton,
    hasHeader,
    title,
    hasFooter,
    hasFooterCloseButton,
    hasFooterActionButton,
    actionButtonText,
    closeButtonText,
    onAction,
    onClose,
  } = props;

  const [isModalOpen, setModalOpen] = useState(isOpen);

  const modalDialogRef = useRef<HTMLDialogElement | null>(null);

  const handleCloseModalClick = () => {
    if (onClose) {
      onClose();
    }
    setModalOpen(false);
  };

  const handleActionModalClick = () => {
    if (onAction) {
      onAction();
    }
    setModalOpen(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDialogElement>) => {
    if (event.key === 'Escape') {
      handleCloseModalClick();
    } else if (event.key === 'Enter') {
      handleActionModalClick();
    }
  };

  useEffect(() => {
    setModalOpen(isOpen);
  }, [isOpen]);

  useEffect(() => {
    const modalElement = modalDialogRef.current;
    if (modalElement) {
      if (isModalOpen) {
        modalElement.showModal();
      } else {
        modalElement.close();
      }
    }
  }, [isModalOpen]);

  return (
    <dialog
      ref={modalDialogRef}
      onKeyDown={handleKeyDown}
      className='bg-slate-700 text-slate-100 backdrop:bg-slate-800 backdrop:bg-opacity-70 open:animate-fade-in open:backdrop:animate-fade-in'
    >
      {hasHeader ? (
        <ModalDialogHeader title={title ? title : 'Boite de dialogue'}>
          {hasTopCloseButton && <ModalButtonClose onClose={handleCloseModalClick} />}
        </ModalDialogHeader>
      ) : (
        hasTopCloseButton && <ModalButtonClose onClose={handleCloseModalClick} />
      )}
      <div className='px-3 py-2'>{children}</div>
      {hasFooter && (
        <ModalDialogFooter>
          {hasFooterActionButton && (
            <button className='' onClick={handleActionModalClick}>
              {actionButtonText ? actionButtonText : 'Ok'}
            </button>
          )}
          {hasFooterCloseButton && (
            <button className='' onClick={handleCloseModalClick}>
              {closeButtonText ? closeButtonText : 'Annuler'}
            </button>
          )}
        </ModalDialogFooter>
      )}
    </dialog>
  );
};
