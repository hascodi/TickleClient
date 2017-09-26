import React from 'react';
// import Immutable from 'immutable';
import _ from 'lodash';
import request from 'superagent';
import jsonp from 'superagent-jsonp';

import MapGL from 'react-map-gl';
// import rasterTileStyle from 'raster-tile-style';
import Pusher from 'pusher-js';
// import ngeohash from 'ngeohash';

import { Card } from './components/cards/Card';
import Modal from './components/utils/Modal';

import ChallengesOverlay from './components/map-layers/ChallengesOverlay';
import UserMarkerOverlay from './components/map-layers/UserMarkerOverlay';

import dummyData from './dummyData';
// const tileSource = '//tile.stamen.com/toner/{z}/{x}/{y}.png';

// const mapStyle = rasterTileStyle([tileSource]);

const accessToken =
  'pk.eyJ1Ijoiam1hdXNoYWciLCJhIjoiY2l2ODkyaDl1MDAwdTJvbnlmbHdvODM0MiJ9.rLkNA-rO4xq0O4_xIeqXVg';

const pusher = new Pusher('cc379270b195d3a20931', {
  cluster: 'eu',
  encrypted: true
});

// function isInMapBounds(coords, mapBounds) {
//   const lng = parseFloat(coords.longitude);
//   const lat = parseFloat(coords.latitude);
//   // const mapBounds = map.getBounds();
//   const boundsCheck =
//     lng > mapBounds.getWest() &&
//     lng < mapBounds.getEast() &&
//     lat < mapBounds.getNorth() &&
//     lat > mapBounds.getSouth();
//
//   if (boundsCheck) {
//     return true;
//   }
//   return false;
// }

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
        latitude: 0,
        longitude: 0,
        // mapStyle: Immutable.fromJS(mapStyle),
        zoom: 20
      },
      cards: [],
      selectedCard: null,
      currentGeoHash: null
    };
  }

  componentDidMount() {
    const self = this;
    window.addEventListener('resize', () => {
      this.setState({
        viewport: Object.assign({}, self.state.viewport, {
          width: window.innerWidth,
          height: window.innerHeight
        })
      });
    });

    const watchPosId = navigator.geolocation.watchPosition(
      pos => {
        // map.setCenter([pos.coords.longitude, pos.coords.latitude]);
        const newViewPort = Object.assign({}, self.state.viewport, {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude
        });

        self.setState({ viewport: newViewPort });
      },
      d => console.log('error watch pos', d),
      { timeout: 1000000 }
    );

    const curPosId = navigator.geolocation.getCurrentPosition(
      pos => {
        console.log('cur pos', pos.coords);
        const newViewPort = Object.assign({}, self.state.viewport, {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude
        });

        self.setState({ viewport: newViewPort });
      },
      d => console.log('error cur pos', d),
      { maximumAge: 0, enableHighAccuracy: true }
    );

    this.setState({ cards: dummyData });
    // request
    //   .get('/api/data')
    //   // .query({ geoHash })
    //   .end((err, res) => {
    //     console.log('response', res);
    //     this.setState({ curPosId, watchPosId, cards: res.body });
    //   });
  }

  componentDidUpdate() {}

  // shouldComponentUpdate(nextProps, nextState) {
  //   return nextState.cards.length !== this.state.cards.length;
  // }

  // componentWillUnmount() {
  //   console.log('unmount', this);
  //
  // }

  componentWillUnmount() {
    console.log('unmount', this);

    window.addEventListener('resize', () => {});
    navigator.geolocation.watchPosition(() => {}, () => {}, { timeout: 1 });
    navigator.geolocation.getCurrentPosition(() => {}, () => {}, {
      timeout: 1
    });
    console.log('curPosId', this.state);

    navigator.geolocation.clearWatch(this.state.watchPosId);
  }

  cardClickHandler(cardProps) {
    const selectedCard = (
      <Card
        {...cardProps}
        closeHandler={() => this.setState({ selectedCard: null })}
      />
    );
    this.setState({ selectedCard });
  }

  _onChangeViewport(viewport) {
    const vp = {
      width: window.innerWidth,
      height: window.innerHeight,
      zoom: viewport.zoom
    };
    console.log('viewport', viewport);

    const newViewPort = Object.assign({}, this.state.viewport, vp);
    this.setState({ viewport: newViewPort });
  }

  _userMove(pos, point) {
    console.log('Pos', pos);
    const viewport = Object.assign({}, this.state.viewport, {
      latitude: pos.lat,
      longitude: pos.lng
    });

    this.setState({
      viewport
    });
  }

  render() {
    return (
      <div key={`${location.pathname}${location.search}`}>
        <Modal content={this.state.selectedCard} />

        <MapGL
          {...this.state.viewport}
          mapboxApiAccessToken={accessToken}
          onChangeViewport={this._onChangeViewport.bind(this)}
          onClick={this._userMove.bind(this)}
          isDragging={false}
          startDragLngLat={null}
        >
          <ChallengesOverlay
            {...this.state.viewport}
            cardClickHandler={this.cardClickHandler.bind(this)}
            cards={this.state.cards}
          />
          <UserMarkerOverlay
            {...this.state.viewport}
            location={{
              latitude: this.state.viewport.latitude,
              longitude: this.state.viewport.longitude
            }}
            id={'exampleUser'}
          />
        </MapGL>
      </div>
    );
    // return r.div([
    //   r(MapGL, Object.assign({}, this.state.viewport,
    //     { mapboxApiAccessToken: accessToken },
    //
    //     {
    //       onChangeViewport: this._onChangeViewport
    //     }), [
    //       r(Overlay, Object.assign({}, this.state.viewport, { locations }))
    //     ])
    // ]);
  }
}
