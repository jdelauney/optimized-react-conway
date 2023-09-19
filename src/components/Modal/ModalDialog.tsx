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
    <header className=''>
      <h2 className=''>{props.title}</h2>
      {props.children}
    </header>
  );
};

const ModalDialogFooter = (props: PropsWithChildren<{}>) => {
  return <footer className=''>{props.children}</footer>;
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
    <dialog ref={modalDialogRef} onKeyDown={handleKeyDown} className=''>
      {hasHeader ? (
        <ModalDialogHeader title={title ? title : 'Boite de dialogue'}>
          {hasTopCloseButton && <ModalButtonClose onClose={handleCloseModalClick} />}
        </ModalDialogHeader>
      ) : (
        hasTopCloseButton && <ModalButtonClose onClose={handleCloseModalClick} />
      )}
      {children}
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
