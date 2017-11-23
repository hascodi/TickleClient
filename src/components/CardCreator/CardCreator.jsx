import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import MapGL from 'react-map-gl';

import { CardMini, CardCont } from '../cards/Card';
import cxx from './CardCreator.scss';

import { ScrollView, ScrollElement } from '../utils/ScrollView';
import DivOverlay from '../utils/map-layers/DivOverlay';
import cardIconSrc from '../utils/map-layers/cardIcon.svg';

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

  scrollTo = name => {
    this._scroller.scrollTo(name);
  };

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
            <DivOverlay {...mapState} data={cards}>
              {(c, [x, y]) =>
                <div
                  key={c.key}
                  style={{
                    position: 'absolute',
                    left: selectedCardId === c.id ? `${0}px` : `${x - w / 2}px`,
                    top: selectedCardId === c.id ? `${0}px` : `${y - h / 2}px`,
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
                      width: c.id === selectedCardId ? `${width}px` : `${w}px`,
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
                  <CardMini
                    key={`${d.title}  ${d.date}`}
                    {...d}
                    {...this.props}
                  />
                </div>
              )}
            </div>
          </div>
        </div>;
      </div>
    );
  }
}

export default CardCreator;
