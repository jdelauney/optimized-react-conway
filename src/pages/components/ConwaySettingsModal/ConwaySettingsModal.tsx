import { ModalDialog } from '../../../components/Modal/ModalDialog';

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
      <div className=''>
        <form>
          <div className=''>
            <label htmlFor=''>Cell size</label>
            <input type='number' name='' id='' />
          </div>
          <div className=''>
            <label htmlFor=''>Cell color</label>
            <input type='color' name='' id='' />
          </div>
          <div className=''>
            <label htmlFor=''>Background color</label>
            <input type='color' name='' id='' />
          </div>
          <div className=''>
            <label htmlFor=''>Grid color</label>
            <input type='color' name='' id='' />
          </div>
        </form>
      </div>
    </ModalDialog>
  );
};
