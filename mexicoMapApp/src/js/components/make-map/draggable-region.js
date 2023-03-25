/**
 * Created by developercomputer on 08.01.16.
 */
import React, { Component, PropTypes } from 'react';
import shouldPureComponentUpdate from './shouldPureComponentUpdate';
import { DragSource } from 'react-dnd';

import Region from "./region.js";


const boxSource = {
  beginDrag(props) {
    const { id, text, code, done_make_map, done_put_names } = props;
    return { id, text, code, done_make_map, done_put_names };
  }
};

//function getStyles(props) {
//  const { left, top, isDragging } = props;
//  const transform = `translate3d(${left}px, ${top}px, 0)`;
//
//  return {
//    transform: transform,
//    WebkitTransform: transform
//  };
//}
@DragSource("DND_REGION", boxSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  connectDragPreview: connect.dragPreview(),
  isDragging: monitor.isDragging()
}))
class DraggableRegion extends Component {

  static propTypes = {
    connectDragSource: PropTypes.func.isRequired,
    connectDragPreview: PropTypes.func.isRequired,
    isDragging: PropTypes.bool.isRequired,
    id: PropTypes.any.isRequired
    //left: PropTypes.number.isRequired,
    //top: PropTypes.number.isRequired
  };

  shouldComponentUpdate = shouldPureComponentUpdate;

  render() {
    const { children, connectDragSource, isDragging } = this.props;
    let visibilityState;
    if(isDragging) {
      visibilityState = { opacity: 0 };
    }

    return connectDragSource(
        <div className="regionsList-el" style={visibilityState}>
          <Region>{children}</Region>
        </div>
    );
  }
}

export default DraggableRegion;
