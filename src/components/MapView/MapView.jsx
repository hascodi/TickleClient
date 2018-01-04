import React from 'react';
// import { Motion, spring } from 'react-motion';
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
import { Card, PreviewCard } from '../cards';
import Grid from './Grid';

// import Modal from './components/utils/Modal';

// import CardOverlay from '../utils/map-layers/CardOverlay';
import UserOverlay from '../utils/map-layers/UserOverlay';
import DivOverlay from '../utils/map-layers/DivOverlay';
import cardIconSrc from '../utils/map-layers/cardIcon.svg';
import Modal from '../utils/Modal';

// import { dummyCards } from '../../dummyData';
//
// // TODO:  change
// dummyCards.forEach((d, i) => {
//   d.id = i;
// });

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
    // const { height, gridHeight } = this.props;
    // console.log('gridSpan  height', height);
    return { columnWidth: 27, span: 4, activeSpan: 8, detail: false };
    // if (gridHeight < height * 3 / 6)
    //   return { columnWidth: 27, span: 3, activeSpan: 4, detail: false };
    // if (gridHeight < height * 4 / 6)
    //   return { columnWidth: 27, span: 4, activeSpan: 5, detail: false };
    // return { columnWidth: 27, span: 6, activeSpan: 8, detail: true };
  }

  render() {
    const {
      cards,
      mapZoom,
      userLocation,
      selectedId,
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
    // const gridConfig = this.gridSpan();
    const selectedCard = selectedId
      ? cards.find(d => d.id === selectedId)
      : null;

    return (
      <div>
        <Modal
          id="exampleModal"
          content={selectedCard}
          visible={cardChallengeOpen}
          closeHandler={() => toggleCardChallenge({ cardChallengeOpen: false })}
        >
          <iframe
            title="emperors"
            src="http://thescalli.com/emperors/"
            style={{ border: 'none', width: '100%', height: '500px' }}
          />
        </Modal>
        <div className={`${cx.cardGridCont}`}>
          <Grid
            {...this.gridSpan()}
            clickHandler={d => selectCard({ selectedId: d })}
            selected={selectedId}
          >
            {cards.map(d => {
              if (selectedId === d.id) {
                return (
                  <Card
                    {...d}
                    collectHandler={() =>
                      toggleCardChallenge({ cardChallengeOpen: true })}
                    closeHandler={() => selectCard({ selectedId: null })}
                  />
                );
              }
              return <PreviewCard {...d} />;
            })}
          </Grid>
        </div>

        <div style={{ position: 'relative' }}>
          <div className={`bg-1 text-center  text-white ${cx.handleBar}`}>
            <span className="align-middle">
              {selectedCard ? selectedCard.place : null}
            </span>
          </div>

          <MapGL
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
          </MapGL>
        </div>
      </div>
    );
  }
}
export default MapView;
