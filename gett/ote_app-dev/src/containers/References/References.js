import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, Text, TouchableOpacity } from 'react-native';
import { Input } from 'components';
import { ReferenceValueSelector } from 'containers';
import { changeReference } from 'actions/booking';
import { strings } from 'locales';
import { isNumber } from 'lodash';
import styles from './styles';


class References extends PureComponent {
  static propTypes = {
    booking: PropTypes.object,
    changeReference: PropTypes.func,
    onClose: PropTypes.func,
    referenceIndex: PropTypes.number
  };

  getReferenceError = () => {
    const { booking: { bookingForm: { bookerReferencesErrors = {} } }, referenceIndex } = this.props;

    return bookerReferencesErrors && bookerReferencesErrors[`bookerReferences.${referenceIndex}.value`];
  };

  renderInputItem = (item) => {
    const { booking: { bookingForm: { costCentre } }, changeReference, onClose } = this.props;
    const error = this.getReferenceError();
    const handleChange = value => changeReference({ ...item, value });
    const handleCostCentre = () => {
      handleChange(costCentre);
      onClose();
    };

    return (
      <View style={styles.inputWrapper}>
        <Input
          label={item.name}
          returnKeyLabel={'Done'}
          returnKeyType={'done'}
          blurOnSubmit
          autoFocus
          onSubmitEditing={onClose}
          value={item.value || ''}
          editable={!item.dropdown}
          onChangeText={handleChange}
          inputStyle={styles.input}
          style={styles.inputContainer}
          error={error}
          pointerEvents={item.dropdown ? 'none' : 'auto'}
        />
        {item.costCentre && !!costCentre &&
          <TouchableOpacity style={styles.costCentre} activeOpacity={0.6} onPress={handleCostCentre}>
            <Text style={styles.costCentreTitle}>{strings('booking.label.usePassengerCostCentre')}</Text>
          </TouchableOpacity>
        }
      </View>
    );
  };

  renderContent = (item) => {
    const { changeReference, onClose } = this.props;
    return (item.dropdown
      ? <ReferenceValueSelector reference={item} changeReference={changeReference} onClose={onClose}/>
      : this.renderInputItem(item)
    );
  };

  render() {
    const { referenceIndex, booking: { bookingForm: { bookerReferences = [] } } } = this.props;
    return isNumber(referenceIndex) && this.renderContent(bookerReferences[referenceIndex]);
  }
}

const mapStateToProps = ({ booking }) => ({
  booking
});

const mapDispatchToProps = ({
  changeReference
});

export default connect(mapStateToProps, mapDispatchToProps)(References);
