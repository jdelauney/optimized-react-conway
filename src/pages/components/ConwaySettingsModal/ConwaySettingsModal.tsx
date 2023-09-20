import { ModalDialog } from '../../../components/ModalDialog/ModalDialog';
import { ConwaySettingsForm } from './ConwaySettingsForm/ConwaySettingsForm';

type ConwaySettingsModalProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

export const ConwaySettingsModal = (props: ConwaySettingsModalProps) => {
  const { isOpen, setIsOpen } = props;

  const handleOnFormSubmitted = () => {
    setIsOpen(false);
  };

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
      <ConwaySettingsForm id='conway-settings-forms' onFormSubmitted={handleOnFormSubmitted} />
    </ModalDialog>
  );
};
