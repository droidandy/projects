import React, { useState, useCallback } from 'react';
import { connect } from 'react-redux';
import Modal from 'react-modal';
import Select from '../Select';
import { countries } from '../../settings';
import { fetchProductGroupsRequest } from '../../../../../../actions/productGroups';
import EqualSection from './components/EqualSection';
import { CheckMark } from 'components/Icons';

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

const AddFilterModal = ({
  isOpen,
  onClose,
  filterOptions,
  filter,
  onSetFilters,
}) => {
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [fields, setFields] = useState([{value: ''}]);

  const onChange = useCallback((filter) => {
    const fieldsOptions = filter.values ? filter.values.map((e) => ({
      label: countries[e] || e,
      value: e,
    })) : null;
    setSelectedFilter({ ...filter, values: fieldsOptions });
    setFields([{value: ''}]);
  }, []);

  const filterArr = (arr) => {
    return arr?.filter(
      (e) => !fields?.map((el) => el.value).includes(e?.value)
    );
  };

  const onSet = () => {
    const newFilter = [
      ...filter.filters,
      {
        id: selectedFilter.value,
        name: selectedFilter.label,
        values: fields.filter((e) => !!e?.value).map((e) => ({value: e?.value, condition: e?.condition})),
      },
    ];
    onSetFilters('filters', newFilter);
    setFields([{value: ''}]);
    onClose();
  };

  const isFieldsEmpty = fields[0] === ''

  const applyButtonIsDisabled = isFieldsEmpty || !selectedFilter
  return (
    <Modal
      isOpen={isOpen}
      className="ReactModal__Content ReactModal__Content-visible"
      onRequestClose={onClose}
      ariaHideApp={false}
      style={customStylesPopUp}
      contentLabel="Add filter"
    >
      <div
        style={{ padding: '20px 30px' }}
        className="purchase-screen__edit-insert__macros-modal"
      >
        <div className="newapp-header__title">Add filter</div>
        <div className="input-wrapper ta-left">
          <label className="l-p__label">Select filter:</label>
          <Select isGroup options={filterOptions} onChange={onChange} value={selectedFilter} />
        </div>
        {selectedFilter && <EqualSection selectedFilter={selectedFilter} fields={fields} setFields={setFields} filterArr={filterArr}/>}
        <div className="input-wrapper oh">
          <button
            className="button button_blue button_160 fl"
            onClick={onClose}
          >
            <span>Cancel</span>
          </button>
          <button
            onClick={onSet}
            className="button button_green button_icon button_160 fr"
            disabled={applyButtonIsDisabled}
          >
            <CheckMark />
            <span>Apply</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default connect(null, { fetchProductGroupsRequest })(AddFilterModal);
