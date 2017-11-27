import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

// import HTML5Backend from 'react-dnd-html5-backend';

import { default as TouchBackend } from 'react-dnd-touch-backend';
import { DragDropContextProvider } from 'react-dnd';

import MapGL from 'react-map-gl';
import update from 'immutability-helper';

import { CardMini, CardCont } from '../cards/Card';
import cxx from './CardCreator.scss';

import DivOverlay from '../utils/map-layers/DivOverlay';
import cardIconSrc from '../utils/map-layers/cardIcon.svg';

import CardDragPreview from './DragLayer/CardDragPreview';

import { DragSourceCont, DropTargetCont } from './DragLayer/SourceTargetCont';
import DragLayer from './DragLayer/DragLayer';

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
    this.state = { selectedCardId: null, newCards: [] };
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
    const {
      mapViewport,
      cards,
      width,
      height,
      changeMapViewport,
      selectedCardId,
      selectCard,
      createCard
    } = this.props;
    const { newCards } = this.state;
    const mapState = { width, height, ...mapViewport };
    const [w, h] = [50, 50];
    const delay = '0.5s';
    return (
      <DragDropContextProvider backend={TouchBackend}>
        <div
          className={`${cxx.base}`}
          style={{ width: `${width}px`, height: `${height}px` }}
        >
          <div style={{ position: 'absolute' }}>
            <DragLayer />
            <MapGL
              {...mapViewport}
              onViewportChange={changeMapViewport}
              width={width}
              height={height}
            >
              <DropTargetCont dropHandler={createCard}>
                <DivOverlay {...mapState} data={cards}>
                  {(c, [x, y], unproject) =>
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
                          selectCard(selectedCardId === c.id ? null : c.id)}
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
                              <CardDragPreview />;
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
                  <div onClick={() => selectCard(d.id)}>
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
