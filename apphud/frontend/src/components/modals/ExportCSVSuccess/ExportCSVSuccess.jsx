import React from 'react';
import Modal from 'react-modal';

const customStylesPopUp = {
  content: {
    position: 'relative',
    margin: 'auto',
    padding: 0,
    borderRadius: 8,
    width: 410,
    overlfow: 'visible',
  },
  overlay: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
};

const ExportCSVSuccessModal = ({ isOpen, onClose }) => {
  return (
    <Modal
      isOpen={isOpen}
      className="ReactModal__Content ReactModal__Content-visible"
      onRequestClose={onClose}
      ariaHideApp={false}
      style={customStylesPopUp}
      contentLabel="Export in progress"
    >
      <div
        style={{ padding: '30px 30px' }}
        className="purchase-screen__edit-insert__macros-modal"
      >
        <div className="newapp-header__title">Export in progress</div>
        <div className="mt10">We will notify you by email when export will be ready for download.</div>
        <div className="oh chart-exportCSV-success-modal_wrapper">
          <button
            className="button button_green button_160"
            onClick={onClose}
          >
            OK
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ExportCSVSuccessModal;
