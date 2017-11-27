import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DragSource, DropTarget } from 'react-dnd';

// import cxx from '../CardCreator.scss';

import CardDragPreview from './CardDragPreview';

// import update from 'immutability-helper';

const style = {
  border: '1px dashed gray',
  // backgroundColor: 'white',
  // padding: '0.5rem 1rem',
  // marginRight: '1.5rem',
  // marginBottom: '1.5rem',
  cursor: 'move'
  // float: 'left'
};

const boxSource = {
  beginDrag(props) {
    return props.children.props;
  }

  // endDrag(props, monitor) {
  //   const item = monitor.getItem();
  //   const dropResult = monitor.getDropResult();
  //
  //   // if (dropResult) {
  //   //   alert(`You dropped ${item.name} into ${dropResult.name}!`); // eslint-disable-line no-alert
  //   // }
  // }
};

@DragSource('DragSourceCont', boxSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging(),
  clientOffset: monitor.getClientOffset(),
  sourceClientOffset: monitor.getSourceClientOffset(),
  diffFromInitialOffset: monitor.getDifferenceFromInitialOffset()
}))
class DragSourceCont extends Component {
  static propTypes = {
    connectDragSource: PropTypes.func.isRequired,
    isDragging: PropTypes.bool.isRequired,
    // name: PropTypes.string.isRequired,
    children: PropTypes.element.isRequired
  };

  render() {
    const { isDragging, connectDragSource, children } = this.props;
    // const { name } = this.props;
    const opacity = isDragging ? 0.4 : 1;

    return connectDragSource(
      <div style={{ ...style, opacity }}>
        {children}
      </div>
    );
  }
}

const boxTarget = {
  drop(props, monitor, component) {
    const delta = monitor.getDifferenceFromInitialOffset();
    const item = monitor.getItem();

    const left = Math.round(delta.x);
    const top = Math.round(delta.y);

    component.moveBox(item.id, left, top);
  }
};

@DropTarget('DragSourceCont', boxTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop(),
  clientOffset: monitor.getClientOffset(),
  sourceClientOffset: monitor.getSourceClientOffset(),
  diffFromInitialOffset: monitor.getDifferenceFromInitialOffset()
}))
class DropTargetCont extends Component {
  static propTypes = {
    connectDropTarget: PropTypes.func.isRequired,
    // isOver: PropTypes.bool.isRequired,
    // canDrop: PropTypes.bool.isRequired,
    // clientOffset: PropTypes.object.isRequired,
    children: PropTypes.element.isRequired,
    // dropped: PropTypes.bool.isRequired,
    dropHandler: PropTypes.func
  };

  static defaultProps = {
    dropHandler: d => d
  };

  constructor(props) {
    super(props);
    this.state = {
      top: 20,
      left: 80,
      dropped: false
    };
  }

  moveBox(id, left, top) {
    this.setState({ id, left, top, dropped: true });
  }

  // componentWillUpdate(nextProps, nextState) {
  //   const { dropHandler } = nextProps;
  //
  //   if (dropped) dropHandler({ id, x: left, y: top });
  // }

  render() {
    const {
      // canDrop,
      // isOver,
      connectDropTarget,
      // clientOffset,
      children,
      dropHandler
    } = this.props;
    const { id, left, top, dropped } = this.state;
    // const { x, y } = clientOffset || { x: 0, y: 0 };

    if (dropped) dropHandler({ id, x: left, y: top });
    return connectDropTarget(
      <div>
        <div
          style={{
            ...style,
            height: `${children.props.height}px`,
            width: `${children.props.width}px`
          }}
        >
          {dropped &&
            <CardDragPreview width={50} height={50} left={left} top={top} />}
        </div>
        {children}
      </div>
    );
  }
}

export { DragSourceCont, DropTargetCont };
