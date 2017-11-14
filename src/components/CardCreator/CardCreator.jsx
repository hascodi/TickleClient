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
    const { selected } = this.state;
    const mapState = { width, height, ...mapViewport };
    console.log('mapState', mapState, mapViewport);
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
              <img
                src={cardIconSrc}
                alt="icon"
                width={30}
                height={40}
                className={cxx.card}
              />
            </DivOverlay>
          </MapGL>
        </div>
        <div
          className="row no-gutters"
          style={{ height: '100%', width: '100%' }}
        >
          <div className="col-2" style={{ height: '100%', width: '100%' }}>
            <div className={cxx.grid}>
              {cards.map(d =>
                <div onClick={() => this.setState({ selected: d })}>
                  <CardMini
                    key={`${d.title}  ${d.date}`}
                    {...d}
                    {...this.props}
                  />
                </div>
              )}
            </div>
          </div>
          {selected &&
            <div className="col-10" style={{ height: '80%', marginTop: '10%' }}>
              <CardCont {...selected} />
            </div>}
        </div>
      </div>
    );
  }
}

export default CardCreator;
