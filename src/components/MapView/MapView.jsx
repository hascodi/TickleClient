import React from 'react';
import { Motion, spring } from 'react-motion';
import PropTypes from 'prop-types';
// import Immutable from 'immutable';
// import _ from 'lodash';
// import request from 'superagent';
// import jsonp from 'superagent-jsonp';

import MapGL from 'react-map-gl';
// import rasterTileStyle from 'raster-tile-style';
// import Pusher from 'pusher-js';
// import ngeohash from 'ngeohash';,
import cx from './MapView.scss';
import { CardCont } from '../cards/Card';
import Grid from './Grid';

// import Modal from './components/utils/Modal';

// import CardOverlay from '../utils/map-layers/CardOverlay';
import UserOverlay from '../utils/map-layers/UserOverlay';
import DivOverlay from '../utils/map-layers/DivOverlay';
import cardIconSrc from '../utils/map-layers/cardIcon.svg';

// import { dummyCards } from '../../dummyData';
//
// // TODO:  change
// dummyCards.forEach((d, i) => {
//   d.id = i;
// });

const Modal = ({ visible, card, closeHandler }) =>
  <div
    className="modal"
    tabIndex="-1"
    style={{ display: visible ? 'block' : 'none' }}
  >
    <div className="modal-dialog" role="document">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title" id="exampleModalLabel">
            Modal title
          </h5>
          <button
            type="button"
            className="close"
            data-dismiss="modal"
            aria-label="Close"
            onClick={closeHandler}
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div className="modal-body">
          {/* TODO: include real game */}
          <iframe
            title="emperors"
            src="http://thescalli.com/emperors/"
            style={{ border: 'none', width: '100%', height: '500px' }}
          />
        </div>
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary"
            data-dismiss="modal"
          >
            Close
          </button>
          <button type="button" className="btn btn-primary">
            Save changes
          </button>
        </div>
      </div>
    </div>
  </div>;

Modal.propTypes = {
  card: PropTypes.object.isRequired,
  visible: PropTypes.bool.isRequired,
  closeHandler: PropTypes.func.isRequired
};

// Modal.defaultProps = {
//   id: 'exampleModal',
//   card: {}
// };

const AnimatedMap = ({
  width,
  height,
  latitude,
  longitude,
  zoom,
  onClick,
  onChangeViewport,
  isDragging,
  startDragLngLat,
  children
}) =>
  <Motion
    style={{
      lat: spring(latitude),
      long: spring(longitude)
    }}
  >
    {({ long, lat }) =>
      <MapGL
        width={width}
        height={height}
        latitude={lat}
        longitude={long}
        zoom={zoom}
        mapboxApiAccessToken={process.env.MapboxAccessToken}
        onChangeViewport={onChangeViewport}
        onClick={onClick}
        isDragging={isDragging}
        startDragLngLat={startDragLngLat}
      >
        {children}
      </MapGL>}
  </Motion>;

AnimatedMap.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  latitude: PropTypes.number,
  longitude: PropTypes.number,
  zoom: PropTypes.number,
  // MapboxAccessToken: PropTypes.string,
  onClick: PropTypes.func,
  onChangeViewport: PropTypes.func,
  isDragging: PropTypes.bool,
  startDragLngLat: PropTypes.number,
  children: PropTypes.node
};

AnimatedMap.defaultProps = {
  width: 400,
  height: 400,
  latitude: 0,
  longitude: 0,
  zoom: 10,
  MapboxAccessToken: 'wrong Api String',
  onClick: d => d,
  onChangeViewport: d => d,
  isDragging: false,
  // TODO: not sure, update
  startDragLngLat: [0, 0],
  children: <div> overlay</div>
};

class MapView extends React.Component {
  static propTypes = {
    cards: PropTypes.array.isRequired,
    mapZoom: PropTypes.number.isRequired,
    userLocation: PropTypes.array.isRequired,
    selectedCard: PropTypes.object.isRequired,
    centerLocation: PropTypes.object.isRequired,
    changeMapViewport: PropTypes.func.isRequired,
    userMove: PropTypes.func.isRequired,
    cardClick: PropTypes.func.isRequired,
    mapHeight: PropTypes.number.isRequired,
    defaultHeight: PropTypes.number.isRequired,
    gridHeight: PropTypes.number.isRequired,
    minHeight: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    selectCard: PropTypes.func.isRequired,
    cardChallengeOpen: PropTypes.bool.isRequired,
    toggleCardChallenge: PropTypes.func.isRequired,
    screenResize: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    // TODO put into container element
    const { screenResize } = props;

    // this._onChangeViewport = this._onChangeViewport.bind(this);
    // this._userMove = this._userMove.bind(this);
    this.gridSpan = this.gridSpan.bind(this);

    window.addEventListener('resize', () => {
      screenResize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    });

    screenResize({
      width: window.innerWidth,
      height: window.innerHeight
    });
  }

  componentDidMount() {
    // const { screenResize } = this.props;
    // window.addEventListener('resize', () => {
    //   this.setState({
    //     mapHeight: {
    //       width: window.innerWidth,
    //       height: window.innerHeight
    //     }
    //   });
    // });

    navigator.geolocation.watchPosition(
      pos => {
        const userLocation = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude
        };

        // TODO:
        const centerLocation = { ...userLocation };
      },
      // 50.846749, 4.352349
      d => console.log('error watch pos', d),
      { timeout: 1000000 }
    );
  }

  componentWillUnmount() {
    window.addEventListener('resize', () => {});
    navigator.geolocation.watchPosition(() => {}, () => {}, { timeout: 1 });
    navigator.geolocation.getCurrentPosition(() => {}, () => {}, {
      timeout: 1
    });

    navigator.geolocation.clearWatch(this.state.watchPosId);
  }

  gridSpan() {
    const { height, gridHeight } = this.props;
    // console.log('gridSpan  height', height);
    if (gridHeight < height * 2 / 6) {
      return { columnWidth: 27, span: 2, activeSpan: 3, detail: false };
    }
    if (gridHeight < height * 3 / 6)
      return { columnWidth: 27, span: 3, activeSpan: 4, detail: false };
    if (gridHeight < height * 4 / 6)
      return { columnWidth: 27, span: 4, activeSpan: 5, detail: false };
    return { columnWidth: 27, span: 6, activeSpan: 8, detail: true };
  }
  render() {
    const {
      cards,
      mapZoom,
      userLocation,
      selectedCard,
      centerLocation,
      changeMapViewport,
      userMove,
      mapHeight,
      width,
      selectCard,
      cardChallengeOpen,
      toggleCardChallenge
    } = this.props;

    // console.log('width', mapDim);
    const mapDim = { width, height: mapHeight };
    // console.log('userLocation', userLocation, 'centerLocation', centerLocation);
    const mapViewport = { ...mapDim, ...centerLocation, zoom: mapZoom };
    const gridConfig = this.gridSpan();
    return (
      <div>
        {selectedCard &&
          <Modal
            id="exampleModal"
            content={selectedCard}
            visible={cardChallengeOpen}
            closeHandler={() =>
              toggleCardChallenge({ cardChallengeOpen: false })}
          />}
        <div className={`${cx.cardGridCont} `}>
          <Grid
            {...gridConfig}
            clickHandler={(card, selected) => {
              selectCard({ card, selected });
            }}
          >
            {cards.map(d => <CardCont {...d} />)}
          </Grid>
        </div>

        <div style={{ position: 'relative' }}>
          <div className={`bg-1 text-center  text-white ${cx.handleBar}`}>
            <span className="align-middle">
              {selectedCard ? selectedCard.place : null}
            </span>
          </div>
          <AnimatedMap
            {...mapViewport}
            onChangeViewport={changeMapViewport}
            onClick={userMove}
            isdragging={false}
            startdraglnglat={null}
          >
            <DivOverlay {...mapViewport} data={cards}>
              <img src={cardIconSrc} alt="icon" width={30} height={40} />
            </DivOverlay>
            <UserOverlay {...mapViewport} location={userLocation} />
          </AnimatedMap>
        </div>
      </div>
    );
  }
}
export default MapView;
