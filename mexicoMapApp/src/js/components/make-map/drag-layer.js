/**
 * Created by developercomputer on 08.01.16.
 */
import React, { Component, PropTypes } from 'react';
import RegionPreview from './region-preview.js';
import { DragLayer } from 'react-dnd';

const layerStyles = {
  position: 'absolute',
  pointerEvents: 'none',
  zIndex: 100,
  left: 0,
  top: 0,
  width: '100%',
  height: '100%'
};

function getItemStyles(props) {
  const { initialOffset, currentOffset } = props;
  if (!initialOffset || !currentOffset) {
    return {
      display: 'none'
    };
  }

  let { x, y } = currentOffset;
  const errorX = 2;
  const errorY = 61;

  const transform = `translate(${x - errorX}px, ${y - errorY}px)`;
  return {
    transform: transform,
    WebkitTransform: transform
  };
}

@DragLayer(monitor => ({
  item: monitor.getItem(),
  itemType: monitor.getItemType(),
  initialOffset: monitor.getInitialSourceClientOffset(),
  currentOffset: monitor.getSourceClientOffset(),
  isDragging: monitor.isDragging()
}))
class CustomDragLayer extends Component {
  static propTypes = {
    item: PropTypes.object,
    itemType: PropTypes.string,
    initialOffset: PropTypes.shape({
      x: PropTypes.number.isRequired,
      y: PropTypes.number.isRequired
    }),
    currentOffset: PropTypes.shape({
      x: PropTypes.number.isRequired,
      y: PropTypes.number.isRequired
    }),
    isDragging: PropTypes.bool.isRequired
  };


  renderItem(type, item) {
    switch (type) {
      case 'make-map':
        return (
            <RegionPreview url={`img/svg--id--${item.code}.svg`} height="60" code={item.code} />
        );
      case 'put-names':
        return (
            <div className="regPrev regPrev_putNames">
              {item.text}
            </div>
        );
      default:
        return null;
    }
  }

  render() {
    const { item, itemType, isDragging, type } = this.props;

    if (!isDragging) {
      return null;
    }

    return (
        <div style={layerStyles}>
          <div style={getItemStyles(this.props)}>
            {this.renderItem(type, item)}
          </div>
        </div>
    );
  }
}

export default CustomDragLayer;
