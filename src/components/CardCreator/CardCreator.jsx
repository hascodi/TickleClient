import React, { Component } from 'react';
// import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

// import HTML5Backend from 'react-dnd-html5-backend';

import { default as TouchBackend } from 'react-dnd-touch-backend';
import { DragDropContextProvider } from 'react-dnd';

import MapGL from 'react-map-gl';
// import update from 'immutability-helper';

import { CardFrame, Card } from '../cards';
import cxx from './CardCreator.scss';

import DivOverlay from '../utils/map-layers/DivOverlay';
import cardIconSrc from '../utils/map-layers/cardIcon.svg';

import CardDragPreview from './DragLayer/CardDragPreview';

import { DragSourceCont, DropTargetCont } from './DragLayer/SourceTargetCont';
import DragLayer from './DragLayer/DragLayer';
import Analytics from './Analytics';
import { Marker } from '../utils';

// const container = ({}) =>

class CardCreator extends Component {
  static propTypes = {
    mapViewport: PropTypes.object,
    cards: PropTypes.array,
    width: PropTypes.number,
    height: PropTypes.number,
    tempCards: PropTypes.array,
    selected: PropTypes.string,
    openCardDetails: PropTypes.func,
    selectCard: PropTypes.func,
    createCard: PropTypes.func,
    screenResize: PropTypes.func,
    changeMapViewport: PropTypes.func,
    dragCard: PropTypes.func
  };

  static defaultProps = {
    mapViewport: {
      width: 100,
      height: 100,
      zoom: 10,
      latitude: 0,
      longitude: 0
    },
    cards: [],
    width: 100,
    height: 100,
    tempCards: [],
    selected: null,
    openCardDetails: d => d,
    selectedCard: d => d,
    createCard: d => d,
    screenResize: d => d,
    changeMapViewport: d => d,
    dragCard: d => d
  };

  constructor(props) {
    super(props);

    const { screenResize } = this.props;
    // TODO: fix later;
    const [width, height] = [window.innerWidth - 4, window.innerHeight];
    screenResize({ width, height });
    // this.state = { newCards: [] };
  }

  componentDidMount() {
    // const el = ReactDOM.findDOMNode(this);
    // scrollTo(5);
    // this._scroller.scrollTo(5);
    console.log('scroller', this._scroller);
  }

  // componentDidUpdate() {}

  // shouldComponentUpdate(nextProps) {
  //   const { mapViewport, tempCards, isDragging } = nextProps;
  //   const newVpStr = JSON.stringify(mapViewport);
  //   const vpStr = JSON.stringify(this.props.mapViewport);
  //   // mapViewport.latitude !== this.props.mapViewport.latitude ||
  //   // mapViewport.longitude !== this.props.mapViewport.longitude;
  //
  //   if (!isDragging) return true;
  //   return false;
  // }

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
    const {
      mapViewport,
      cards,
      width,
      height,
      changeMapViewport,
      openCardDetails,
      selectCard,
      selected,
      createCard,
      tempCards,
      dragCard,
      highlighted
    } = this.props;

    const mapState = { width, height, ...mapViewport };
    const [w, h] = [50, 50];

    const selectedCardId = selected ? selected.id : null;
    const selectedExtended = selected ? selected.extended : null;

    console.log('selected', selected);

    return (
      <DragDropContextProvider backend={TouchBackend}>
        <div
          className={`${cxx.base}`}
          style={{ width: `${width}px`, height: `${height}px` }}
        >
          <div style={{ position: 'absolute' }}>
            <DragLayer />
            <DropTargetCont dropHandler={createCard}>
              <MapGL
                {...mapViewport}
                width={width}
                height={height}
                onViewportChange={changeMapViewport}
              >
                {/* TODO: change Key */}
                <DivOverlay {...mapState} data={tempCards}>
                  {(c, [x, y]) =>
                    <Marker
                      key={c.id}
                      selected={highlighted}
                      width={highlighted ? width : w}
                      height={highlighted ? height : h}
                      x={x}
                      y={y}
                      zIndex={1000}
                      onClick={() => openCardDetails(c.id)}
                    >
                      <DragSourceCont
                        key={`${c.title}  ${c.date}`}
                        dragHandler={dragCard}
                      >
                        <div style={{ background: 'lightgreen' }}>
                          {highlighted ? <Card {...c} /> : <CardDragPreview />}
                        </div>
                      </DragSourceCont>
                    </Marker>}
                </DivOverlay>
                <DivOverlay {...mapState} data={cards}>
                  {(c, [x, y]) =>
                    <Marker
                      key={Math.random()}
                      selected={selectedCardId === c.id}
                      width={c.id === selectedCardId ? width : w}
                      height={c.id === selectedCardId ? height : h}
                      x={x}
                      y={y}
                      onClick={() => selectCard(c)}
                    >
                      <div>
                        {selectedExtended
                          ? <Card {...c} />
                          : <CardDragPreview />}
                      </div>
                    </Marker>}
                </DivOverlay>
              </MapGL>
            </DropTargetCont>
          </div>
          <div className="row no-gutters">
            <div
              className={`col-12 ${cxx.animHeight}`}
              style={{
                height: `${selected ? height / 2 : 0}px`,
                background: 'white',
                zIndex: 10000
              }}
            >
              <Analytics
                width={width}
                height={height / 2}
                closeHandler={() => selectCard(null)}
              />
            </div>
            <div className="col-2">
              <div
                className={cxx.grid}
                style={{
                  transition: 'opacity .25s ease-in-out',
                  opacity: !selected ? 1 : 0
                }}
              >
                <DragSourceCont key={'newCard'}>
                  <div className={cxx.cardTemp}>
                    <i className="fa fa-4x fa-plus" aria-hidden="true" />
                  </div>
                </DragSourceCont>
                {cards.map(d =>
                  <div onClick={() => openCardDetails(d.id)}>
                    <DragSourceCont key={`${d.title}  ${d.date}`}>
                      <div style={{ border: '1px dashed gray' }}>
                        <CardFrame {...d} {...this.props} />
                      </div>
                    </DragSourceCont>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </DragDropContextProvider>
    );
  }
}

export default CardCreator;
