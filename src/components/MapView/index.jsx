import React from 'react';
// import Immutable from 'immutable';
// import _ from 'lodash';
// import request from 'superagent';
// import jsonp from 'superagent-jsonp';

import MapGL from 'react-map-gl';
import Resizable from 're-resizable';
// import rasterTileStyle from 'raster-tile-style';
// import Pusher from 'pusher-js';
// import ngeohash from 'ngeohash';

import { Card } from '../cards/Card';
import Carousel from './Carousel';
// import Modal from './components/utils/Modal';

import CardOverlay from './map-layers/CardOverlay';
import UserOverlay from './map-layers/UserOverlay';

import dummyData from '../../dummyData';
// const tileSource = '//tile.stamen.com/toner/{z}/{x}/{y}.png';

// const mapStyle = rasterTileStyle([tileSource]);

const accessToken =
  'pk.eyJ1Ijoiam1hdXNoYWciLCJhIjoiY2l2ODkyaDl1MDAwdTJvbnlmbHdvODM0MiJ9.rLkNA-rO4xq0O4_xIeqXVg';

// const pusher = new Pusher('cc379270b195d3a20931', {
//   cluster: 'eu',
//   encrypted: true
// });

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

class MapView extends React.Component {
  constructor(props) {
    super(props);
    const { headerPad } = props;
    const height = window.innerHeight - headerPad;
    this.state = {
      mapDim: {
        width: window.innerWidth,
        height: height / 2
      },
      mapZoom: 20,
      cardDim: {
        width: window.innerWidth,
        height: height / 2
      },
      userLocation: {
        latitude: 0,
        longitude: 0
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
        mapDim: {
          width: window.innerWidth,
          height: window.innerHeight
        }
      });
    });

    const watchPosId = navigator.geolocation.watchPosition(
      pos => {
        // map.setCenter([pos.coords.longitude, pos.coords.latitude]);
        const userLocation = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude
        };

        self.setState({ userLocation });
      },
      d => console.log('error watch pos', d),
      { timeout: 1000000 }
    );

    const curPosId = navigator.geolocation.getCurrentPosition(
      pos => {
        console.log('cur pos', pos.coords);
        const userLocation = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude
        };

        self.setState(userLocation);
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
    const mapDim = {
      width: window.innerWidth,
      height: window.innerHeight
    };
    console.log('viewport', viewport);

    this.setState({ mapDim, mapZoom: viewport.zoom });
  }

  _userMove(pos, point) {
    console.log('Pos', pos);
    const userLocation = {
      latitude: pos.lat,
      longitude: pos.lng
    };

    this.setState({ userLocation });
  }

  render() {
    const { mapDim, userLocation, mapZoom, cardDim } = this.state;
    const mapViewport = { ...mapDim, ...userLocation, zoom: mapZoom };
    return (
      <div key={`${location.pathname}${location.search}`}>
        <Resizable
          style={{ border: '2px solid black' }}
          enable={{
            top: false,
            right: false,
            bottom: true,
            left: false,
            topRight: false,
            bottomRight: false,
            bottomLeft: false,
            topLeft: false
          }}
          defaultSize={cardDim}
          onResizeStop={(e, direction, ref, d) => {
            this.setState(oldState => ({
              mapDim: {
                width: oldState.mapDim.width - d.width,
                height: oldState.mapDim.height - d.height
              }
            }));
          }}
        >
          <Carousel />
        </Resizable>
        <div style={{ position: 'relative' }}>
          <MapGL
            {...mapViewport}
            mapboxApiAccessToken={accessToken}
            onChangeViewport={this._onChangeViewport.bind(this)}
            onClick={this._userMove.bind(this)}
            isDragging={false}
            startDragLngLat={null}
          >
            <CardOverlay
              {...mapViewport}
              cardClickHandler={this.cardClickHandler.bind(this)}
              cards={this.state.cards}
            />
            <UserOverlay {...mapViewport} location={userLocation} />
          </MapGL>
        </div>
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
MapView.defaultProps = {
  headerPad: 60
};
export default MapView;
