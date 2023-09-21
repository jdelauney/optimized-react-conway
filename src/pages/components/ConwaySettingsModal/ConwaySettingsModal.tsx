import { useContext, useEffect, useRef } from 'react';
import { ModalDialog } from '../../../components/ModalDialog/ModalDialog';
import { ConwaySettingsForm } from './ConwaySettingsForm/ConwaySettingsForm';
import { ConwayContext } from '../../../contexts/ConwayContext';

type ConwaySettingsModalProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

export const ConwaySettingsModal = (props: ConwaySettingsModalProps) => {
  const { isOpen, setIsOpen } = props;

  const { setIsReady } = useContext(ConwayContext);
  const inputFocusedRef = useRef<HTMLInputElement>(null);

  const handleOnFormSubmitted = () => {
    setIsReady(false);
    setIsOpen(false);
  };

  useEffect(() => {
    if (isOpen) {
      inputFocusedRef.current?.focus();
    }
  }, [isOpen]);

  return (
    <ModalDialog
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      hasTopCloseButton={true}
      hasHeader={true}
      title='Conway Settings'
      hasFooter={true}
      hasFooterCloseButton={true}
      hasFooterActionButton={true}
      actionButtonText='Valider'
      closeButtonText='Fermer'
      attachedFormId='conway-settings-forms'
    >
      <ConwaySettingsForm id='conway-settings-forms' onFormSubmitted={handleOnFormSubmitted} ref={inputFocusedRef} />
    </ModalDialog>
  );
};
