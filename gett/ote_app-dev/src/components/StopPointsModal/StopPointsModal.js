import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Text, TouchableWithoutFeedback, View } from 'react-native';
import SortableListView from 'react-native-sortable-listview';
import { omit, values } from 'lodash';

import { Modal, Icon, Divider, Button } from 'components';

import { color, withTheme } from 'theme';
import { showInfoAlert, vibrate } from 'utils';

import { strings } from 'locales';

import { containers } from 'testIDs';

import styles from './styles';

const ORDER_PANEL_WIDTH = 40;
const ROW_HEIGHT = 58;

const IDs = containers.StopPointsModal;

class StopPointsModal extends PureComponent {
  static propTypes = {
    areAddressesUnique: PropTypes.func,
    data: PropTypes.object.isRequired,
    isVisible: PropTypes.bool,
    onAddPoint: PropTypes.func.isRequired,
    onChangeAddress: PropTypes.func,
    onClose: PropTypes.func.isRequired,
    onEditAddress: PropTypes.func.isRequired,
    onRowMoved: PropTypes.func.isRequired,
    postEvent: PropTypes.func,
    themedStyles: PropTypes.object
  };

  static defaultProps = {
    isVisible: false
  };

  state = {
    isDragging: false
  };

  get orderKeys() {
    return Object.keys(this.props.data);
  }

  handleEditAddress = (indexToDelete) => {
    if (indexToDelete < 0) {
      this.props.onAddPoint();
      return;
    }
    const { data, onEditAddress } = this.props;

    const keys = this.orderKeys;
    const index = keys.findIndex(item => data[item].index === indexToDelete);
    const address = data[keys[index]];
    const type = index <= (keys.length - 1) ? 'stops' : 'destinationAddress';

    onEditAddress(address, { type, index }, true);
  };

  handleDeleteAddress = (index) => {
    const { data, areAddressesUnique } = this.props;

    const editedStops = values(omit(data, `stop${index}`));

    if (areAddressesUnique(editedStops)) {
      this.props.onChangeAddress(editedStops);
    } else {
      showInfoAlert({ message: strings('alert.message.pathDuplication'), modal: true });
    }
  };

  handleRowMoved = (meta) => {
    const orderKeys = this.orderKeys;
    orderKeys.splice(meta.to, 0, orderKeys.splice(meta.from, 1)[0]);

    this.changePath(this.props.data, orderKeys);
  };

  changePath = (data, order) => {
    const { onChangeAddress, postEvent } = this.props;
    const stops = order.map(id => data[id]);

    onChangeAddress(stops);
    postEvent('ordering_screen|stop_points|stop_point_moved', { stop_points: stops.length });
  };

  renderRow = ({ line, index = -1, textStyle = null, canDelete = true }) => {
    const { isDragging } = this.state;
    const { themedStyles } = this.props;

    return (
      <TouchableWithoutFeedback
        onPress={this.handleEditAddress.bind(null, index)}
        testID={`${IDs.list}[${index}]`}
      >
        <View style={[themedStyles.rowWrapper, { height: ROW_HEIGHT }]}>
          <View style={themedStyles.rowInnerWrapper}>
            <View style={themedStyles.dragButton}>
              <Icon name="drag" size={15} color={color.arrowRight} />
            </View>

            <Text style={textStyle || themedStyles.listItemLabel} numberOfLines={1}>{line}</Text>

            {canDelete &&
              <TouchableWithoutFeedback
                onPress={this.handleDeleteAddress.bind(null, index)}
                testID={`${IDs.list}[${index}]/close`}
              >
                <View style={themedStyles.deleteButton}>
                  <Icon name="close" size={14} color={color.secondaryText} />
                </View>
              </TouchableWithoutFeedback>
            }
          </View>
          {!isDragging &&
            <View style={themedStyles.dividerWrapper}>
              <Divider left={2} />
            </View>
          }
        </View>
      </TouchableWithoutFeedback>
    );
  };

  isAddStopAvailable = (index = Object.values(this.orderKeys).length) => index <= 4;

  renderAddButton = () => {
    const { themedStyles } = this.props;
    return (
      <Button
        type="secondary"
        size="mid"
        stretched
        styleContent={themedStyles.btnView}
        onPress={this.handleEditAddress.bind(null, -1)}
        title={strings('booking.label.addStopPoint')}
        testID={IDs.addStopBtn}
      />
    );
  };

  renderStops = () => {
    const { themedStyles } = this.props;

    const renderIt = ({ child, index = '+', needIcon = true }) => (
      <View key={index} style={themedStyles.counterItemContainer}>
        {needIcon &&
          <View style={themedStyles.dividerLineBtnStyle}>
            <Icon name="dottedLine" pointsNum={9} size={34} color={color.arrowRight}/>
          </View>}
        <View style={themedStyles.counterRoundedWrapperStyle}>
          {child || <Text style={themedStyles.counterTextStyle}>{index + 1}</Text>}
        </View>
      </View>
    );

    const renderIterator = () => (
      this.orderKeys.map((child, index) => renderIt({ index, needIcon: this.isAddStopAvailable(index) && index > 0 }))
    );

    return (
      <View style={[themedStyles.leftPanelContainer, { height: this.getListHeight() }]}>
        {this.orderKeys.length > 0 && renderIterator()}
      </View>
    );
  };

  getListHeight = (defaultHeight = ROW_HEIGHT) => this.orderKeys.length * defaultHeight;

  handleDragStart = () => this.setState({ isDragging: true });

  handleDragStop = () => this.setState({ isDragging: false });

  handleRowActive = () => {
    vibrate({ pattern: 40, type: 'selection' });
  };

  renderList = () => {
    const { data, themedStyles } = this.props;

    return (
      <View style={[themedStyles.wrapper, { height: 40 + ROW_HEIGHT + this.getListHeight() }]}>
        <View style={{ height: this.getListHeight() }}>
          <SortableListView
            data={data}
            order={this.orderKeys}
            disableSorting={this.orderKeys && this.orderKeys.length <= 1}
            activeOpacity={0.92}
            sortRowStyle={themedStyles.sortRowStyle}
            onMoveStart={this.handleDragStart}
            onMoveEnd={this.handleDragStop}
            onRowMoved={this.handleRowMoved}
            onRowActive={this.handleRowActive}
            renderRow={this.renderRow}
            scrollEnabled={false}
            limitScrolling
            moveOnPressIn
          />
        </View>
      </View>
    );
  };

  renderOrderPanel = () => (
    <View style={[this.props.themedStyles.orderPanel, { width: ORDER_PANEL_WIDTH, height: this.getListHeight() }]}>
      {!this.state.isDragging && this.renderStops()}
    </View>
  );

  render() {
    const { isVisible, onClose } = this.props;

    const height = 40 + this.getListHeight() + (this.isAddStopAvailable() ? ROW_HEIGHT : 0);

    return (
      <Modal
        isVisible={isVisible}
        onClose={onClose}
        testID={IDs.view}
      >
        <View style={{ height }}>
          <View style={{ flexDirection: 'row', height: this.getListHeight() }}>
            {this.renderOrderPanel()}
            {this.renderList()}
          </View>
          {this.isAddStopAvailable() && this.renderAddButton()}
        </View>
      </Modal>
    );
  }
}

export default withTheme(StopPointsModal, styles);
