import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import { DragSource, DropTarget, DragDropContextProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { default as TouchBackend } from 'react-dnd-touch-backend';
import MapGL from 'react-map-gl';
import update from 'immutability-helper';

import { CardMini, CardCont } from '../cards/Card';
import cxx from './CardCreator.scss';

// import { ScrollView, ScrollElement } from '../utils/ScrollView';
import DivOverlay from '../utils/map-layers/DivOverlay';
import cardIconSrc from '../utils/map-layers/cardIcon.svg';

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
    console.log('item', item);

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
    isOver: PropTypes.bool.isRequired,
    canDrop: PropTypes.bool.isRequired,
    clientOffset: PropTypes.object.isRequired,
    children: PropTypes.element.isRequired,
    dropped: PropTypes.bool.isRequired
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
    this.setState({ left, top, dropped: true });
  }

  render() {
    const {
      canDrop,
      isOver,
      connectDropTarget,
      clientOffset,
      children
    } = this.props;
    const { dropped, left, top } = this.state;
    const { x, y } = clientOffset || { x: 0, y: 0 };

    console.log('dropped', this.state);

    const isActive = canDrop && isOver;
    let backgroundColor = '#222';
    if (isActive) {
      backgroundColor = 'darkgreen';
    } else if (canDrop) {
      backgroundColor = 'darkkhaki';
    }
    return connectDropTarget(
      <div>
        <div
          style={{
            ...style,
            height: `${children.props.height}px`,
            width: `${children.props.width}px`
          }}
        >
          {isActive ? 'Release to drop' : 'Drag a box here'}
          {dropped &&
            <img
              width={50}
              height={50}
              src={cardIconSrc}
              alt="icon"
              className={cxx.card}
              style={{
                position: 'absolute',
                left: `${left}px`,
                top: `${top}px`
              }}
            />}
        </div>
        {children}
      </div>
    );
  }
}

class CardCreator extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    screenResize: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    const { screenResize, cards } = this.props;
    // TODO: fix later;
    const [width, height] = [window.innerWidth - 4, window.innerHeight];
    screenResize({ width, height });
    this.state = { selected: null };
  }

  componentDidMount() {
    // const el = ReactDOM.findDOMNode(this);
    // scrollTo(5);
    // this._scroller.scrollTo(5);
    console.log('scroller', this._scroller);
  }

  componentDidUpdate() {}

  // scrollTo = name => {
  //
  //   this._scroller.scrollTo(name);
  // };

  // latitude={lat}
  // longitude={long}
  // zoom={zoom}
  // mapboxApiAccessToken={process.env.MapboxAccessToken}
  // onChangeViewport={onChangeViewport}
  // onClick={onClick}
  // isDragging={isDragging}
  // startDragLngLat={startDragLngLat}
  render() {
    const { mapViewport, cards, width, height, changeMapViewport } = this.props;
    const { selectedCardId } = this.state;
    const mapState = { width, height, ...mapViewport };
    console.log('mapState', mapState, mapViewport);
    const [w, h] = [50, 50];
    const delay = '.75s';
    return (
      <DragDropContextProvider backend={TouchBackend}>
        <div
          className={`${cxx.base}`}
          style={{ width: `${width}px`, height: `${height}px` }}
        >
          <div style={{ position: 'absolute' }}>
            <MapGL
              {...mapViewport}
              onViewportChange={changeMapViewport}
              width={width}
              height={height}
            >
              <DropTargetCont>
                <DivOverlay {...mapState} data={cards}>
                  {(c, [x, y]) =>
                    <div
                      key={c.key}
                      style={{
                        position: 'absolute',
                        left:
                          selectedCardId === c.id ? `${0}px` : `${x - w / 2}px`,
                        top:
                          selectedCardId === c.id ? `${0}px` : `${y - h / 2}px`,
                        width: `${w}px`,
                        height: `${h}px`,
                        cursor: 'pointer',
                        transition: `left ${delay}, top ${delay}`,
                        zIndex: selectedCardId === c.id ? 1000 : null
                      }}
                    >
                      <div
                        onClick={() =>
                          this.setState(oldState => ({
                            selectedCardId:
                              oldState.selectedCardId === c.id ? null : c.id
                          }))}
                        style={{
                          width:
                            c.id === selectedCardId ? `${width}px` : `${w}px`,
                          height:
                            c.id === selectedCardId ? `${height}px` : `${h}px`,
                          transition: `width ${delay}, height ${delay}`
                        }}
                      >
                        {
                          do {
                            if (selectedCardId === c.id) {
                              <CardCont {...c} />;
                            } else {
                              <img
                                src={cardIconSrc}
                                alt="icon"
                                className={cxx.card}
                              />;
                            }
                          }
                        }
                      </div>
                    </div>}
                </DivOverlay>
              </DropTargetCont>
            </MapGL>
          </div>
          <div
            className="row no-gutters"
            style={{
              height: '100%',
              width: '100%',
              opacity: !selectedCardId ? 1 : 0,
              transition: 'opacity .25s ease-in-out'
            }}
          >
            <div
              className="col-2"
              style={{
                height: '100%',
                width: '100%'
              }}
            >
              <div className={cxx.grid}>
                {cards.map(d =>
                  <div onClick={() => this.setState({ selectedCardId: d.id })}>
                    <DragSourceCont key={`${d.title}  ${d.date}`}>
                      <CardMini {...d} {...this.props} />
                    </DragSourceCont>
                  </div>
                )}
              </div>
            </div>
          </div>;
        </div>
      </DragDropContextProvider>
    );
  }
}

export default CardCreator;
