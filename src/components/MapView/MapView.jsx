import React from 'react';
import * as d3 from 'd3';
import VisibilitySensor from 'react-visibility-sensor';
import 'mapbox-gl/dist/mapbox-gl.css';

// import { Motion, spring } from 'react-motion';
import PropTypes from 'prop-types';
// import Immutable from 'immutable';
// import _ from 'lodash';
// import request from 'superagent';
// import jsonp from 'superagent-jsonp';

import MapGL, { LinearInterpolator, FlyToInterpolator } from 'react-map-gl';
// import rasterTileStyle from 'raster-tile-style';
// import ngeohash from 'ngeohash';,
import cx from './MapView.scss';
import { Card, PreviewCard } from '../cards';
import Grid from 'mygrid/dist';

// console.log('grid', Grid);
// import { Grid } from '../utils';
// import { ScrollElement, ScrollView } from '../utils/ScrollView';

// import Modal from './components/utils/Modal';

// import CardOverlay from '../utils/map-layers/CardOverlay';
import {
  DivOverlay,
  UserOverlay,
  CardMarker,
  AnimMarker
} from '../utils/map-layers/DivOverlay';
// import cardIconSrc from '../utils/map-layers/cardIcon.svg';
import { Modal } from '../utils';

class CardGrid extends React.Component {
  static propTypes = {
    cards: PropTypes.array.isRequired,
    onSelect: PropTypes.func.isRequired,
    onExtend: PropTypes.func.isRequired,
    offset: PropTypes.number.isRequired
  };

  shouldComponentUpdate() {
    return false;
  }

  render() {
    const { cards, onSelect, onExtend, offset } = this.props;
    // TODO: isVisible
    return (
      <div
        className={`${cx.cardGridCont}`}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          // zIndex: 10,
          marginTop: '20px'
        }}
      >
        <Grid
          rows={1}
          cols={Math.floor(cards.length) * 2}
          colSpan={2}
          rowSpan={1}
          gap={2}
          style={{ width: `${cards.length * 40}%` }}
        >
          {cards.map(d =>
            <VisibilitySensor
              offset={{ left: offset, right: offset }}
              onChange={visible => visible && onSelect(d.id)}
            >
              {({ isVisible }) =>
                <PreviewCard
                  {...d}
                  onClick={() => isVisible && onExtend(d.id)}
                  style={{ opacity: !isVisible ? 0.56 : null, height: '100%' }}
                />}
            </VisibilitySensor>
          )}
        </Grid>
      </div>
    );
  }
}

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
    selectedCardId: PropTypes.string.isRequired,
    extCardId: PropTypes.string.isRequired,
    centerLocation: PropTypes.object.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    cardChallengeOpen: PropTypes.bool.isRequired,

    userMoveAction: PropTypes.func.isRequired,
    changeMapViewportAction: PropTypes.func.isRequired,
    selectCardAction: PropTypes.func.isRequired,
    extCardAction: PropTypes.func.isRequired,
    toggleCardChallengeAction: PropTypes.func.isRequired,
    screenResizeAction: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    // TODO put into container element
    const { screenResizeAction } = props;

    // this._onChangeViewport = this._onChangeViewport.bind(this);
    // this._userMove = this._userMove.bind(this);
    // this.gridSpan = this.gridSpan.bind(this);

    window.addEventListener('resize', () => {
      screenResizeAction({
        width: window.innerWidth,
        height: window.innerHeight
      });
    });

    // TODO: respect margins
    screenResizeAction({
      width: window.innerWidth,
      height: window.innerHeight
    });
    this.scrollTo = scrollTo.bind(this);
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

  render() {
    const {
      cards,
      mapZoom,
      userLocation,
      selectedCardId,
      centerLocation,
      width,
      height,
      extCardId,

      userMoveAction,
      changeMapViewportAction,
      selectCardAction,
      extCardAction,
      // cardChallengeOpen,
      toggleCardChallengeAction
    } = this.props;

    // console.log('width', mapDim);
    const mapDim = { width, height };
    // console.log('userLocation', userLocation, 'centerLocation', centerLocation);
    const mapViewport = { ...mapDim, ...centerLocation, zoom: mapZoom };
    // const gridConfig = this.gridSpan();
    const selectedCard = selectedCardId
      ? cards.find(d => d.id === selectedCardId)
      : null;

    return (
      <div style={{ position: 'relative' }}>
        <div style={{ position: 'absolute', left: 0, right: 0 }}>
          <MapGL
            {...mapViewport}
            onViewportChange={changeMapViewportAction}
            isdragging={false}
            startdraglnglat={null}
          >
            <DivOverlay {...mapViewport} data={cards}>
              {(c, [x, y]) =>
                <AnimMarker
                  key={c.id}
                  selected={extCardId === c.id}
                  width={extCardId === c.id ? width - 10 : 40}
                  height={extCardId === c.id ? height - 5 : 50}
                  x={x}
                  y={y}
                >
                  <Card
                    {...c}
                    style={{ height: '100%' }}
                    onClose={() => extCardAction(null)}
                  />
                </AnimMarker>}
            </DivOverlay>
            <UserOverlay {...mapViewport} location={userLocation} />
          </MapGL>
        </div>
        <Modal
          id="exampleModal"
          content={selectedCard}
          visible={false}
          closeHandler={() =>
            toggleCardChallengeAction({ cardChallengeOpen: false })}
        >
          <iframe
            title="emperors"
            src="http://thescalli.com/emperors/"
            style={{ border: 'none', width: '100%', height: '500px' }}
          />
        </Modal>

        <CardGrid
          cards={cards}
          onSelect={selectCardAction}
          onExtend={extCardAction}
          offset={width / 6}
        />
      </div>
    );
  }
}
export default MapView;
