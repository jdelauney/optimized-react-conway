import { useContext, useEffect } from 'react';
import { ModalDialog } from '../../../components/ModalDialog/ModalDialog';
import { ConwayContext } from '../../../contexts/ConwayContext';
import { ConwaySettingsForm } from './ConwaySettingsForm';

type ConwaySettingsModalProps = {
  isOpen: boolean;
  onAction?: () => void;
  onClose?: () => void;
};

export const ConwaySettingsModal = (props: ConwaySettingsModalProps) => {
  const { isOpen, onAction, onClose } = props;

  //const { setIsReady } = useContext(ConwayContext);

  // useEffect(() => {
  //   setIsReady(!isOpen);
  // }, [isOpen]);

  const handleActionModalClick = () => {
    if (onAction) {
      onAction();
    }
  };

  const handleCloseModalClick = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <ModalDialog
      isOpen={isOpen}
      hasTopCloseButton={true}
      hasHeader={true}
      title='Conway Settings'
      hasFooter={true}
      hasFooterCloseButton={true}
      hasFooterActionButton={true}
      actionButtonText='Valider'
      closeButtonText='Fermer'
      attachedFormId='conway-settings-forms'
      onAction={handleActionModalClick}
      onClose={handleCloseModalClick}
    >
      <ConwaySettingsForm id='conway-settings-forms' />
    </ModalDialog>
  );
};
