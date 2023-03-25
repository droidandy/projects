import React, { useState } from 'react';
import { connect } from 'react-redux';
import Modal from 'react-modal';
import axios from 'axios';
import { MAX_TO_EXPORT_CHARTS_FOR_FREE_PLAN } from '../../../constants';
import {track} from "../../../libs/helpers";

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

const ExportCSVModal = ({
  isOpen,
  onClose,
  onExport,
  application,
  paramsForRequest,
  chartType,
  user,
  rowsToExport,
}) => {
  const [loading, setLoading] = useState(false);

  const handleClickOnExport = () => {
    setLoading(true);
    const url =
      chartType === 'column'
        ? '/api/v1/chart/export/column'
        : '/api/v1/chart/export/line';

    axios.post(url, paramsForRequest).then(
      () => {
        setLoading(false);
        onClose();
        onExport();
        track("charts_export_submitted");
      },
      () => {
        setLoading(false);
        onClose();
      }
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      className="ReactModal__Content ReactModal__Content-visible"
      onRequestClose={onClose}
      ariaHideApp={false}
      style={customStylesPopUp}
      contentLabel="Export data"
    >
      <div
        style={{ padding: '20px 30px' }}
        className="purchase-screen__edit-insert__macros-modal"
      >
        <div className="newapp-header__title">Export data</div>
        {user.subscription.plan.free && rowsToExport > MAX_TO_EXPORT_CHARTS_FOR_FREE_PLAN && (
          <div className="chart-exportCSV-modal_warning">
            You can export up to 10,000 rows on Free plan. Upgrade to export
            more.
          </div>
        )}
        <div className="bold mt30">
          Rows to export: {rowsToExport > MAX_TO_EXPORT_CHARTS_FOR_FREE_PLAN ? MAX_TO_EXPORT_CHARTS_FOR_FREE_PLAN : rowsToExport}
        </div>
        <div className="input-wrapper oh">
          <button
            className="button button_grey button_160 fl"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="button button_green button_icon button_160 fr"
            onClick={handleClickOnExport}
            disabled={loading}
          >
            Export
          </button>
        </div>
      </div>
    </Modal>
  );
};

const mapStateToProps = (state) => {
  return {
    application: state.application,
    user: state.user
  };
};

export default connect(mapStateToProps, null)(ExportCSVModal);
