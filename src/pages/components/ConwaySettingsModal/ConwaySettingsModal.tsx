import { ModalDialog } from '../../../components/ModalDialog/ModalDialog';
import { ConwaySettingsForm } from './ConwaySettingsForm';

type ConwaySettingsModalProps = {
  isOpen: boolean;
  onAction?: () => void;
  onClose?: () => void;
};

export const ConwaySettingsModal = (props: ConwaySettingsModalProps) => {
  const { isOpen, onAction, onClose } = props;

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

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('submit');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('change');
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
      onAction={handleActionModalClick}
      onClose={handleCloseModalClick}
    >
      <ConwaySettingsForm onSubmit={handleFormSubmit} onInputChange={handleInputChange} />
    </ModalDialog>
  );
};
