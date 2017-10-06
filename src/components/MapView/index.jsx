import React from 'react';

import { Motion, spring } from 'react-motion';
// import Immutable from 'immutable';
// import _ from 'lodash';
// import request from 'superagent';
// import jsonp from 'superagent-jsonp';

import MapGL from 'react-map-gl';
import Resizable from 're-resizable';
// import rasterTileStyle from 'raster-tile-style';
// import Pusher from 'pusher-js';
// import ngeohash from 'ngeohash';,
import cx from './index.scss';
import { CardCont } from '../cards/Card';
import Grid from './Grid';

// import Modal from './components/utils/Modal';

import CardOverlay from './map-layers/CardOverlay';
import UserOverlay from './map-layers/UserOverlay';

import dummyData from '../../dummyData';

dummyData.forEach((d, i) => {
  d.id = i;
});
// import Slider from 'react-slick';

// const tileSource = '//tile.stamen.com/toner/{z}/{x}/{y}.png';

// const mapStyle = rasterTileStyle([tileSource]);

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

const AnimatedMap = ({
  width,
  height,
  latitude,
  longitude,
  zoom,
  MapboxAccessToken,
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
        isDragging={false}
        startDragLngLat={startDragLngLat}
      >
        {children}
      </MapGL>}
  </Motion>;

class MapView extends React.Component {
  constructor(props) {
    super(props);
    const { headerPad } = props;

    this.cardClickHandler = this.cardClickHandler.bind(this);
    this._onChangeViewport = this._onChangeViewport.bind(this);
    this._userMove = this._userMove.bind(this);
    this.gridSpan = this.gridSpan.bind(this);

    const height = window.innerHeight - headerPad;
    this.state = {
      height,
      mapDim: {
        width: window.innerWidth,
        height: height / 2
      },
      mapZoom: 20,
      gridDim: {
        width: window.innerwidth * 2,
        height: height / 2
      },
      gridDefDim: {
        width: window.innerwidth,
        height: height / 2
      },
      centerLocation: {
        latitude: 0,
        longitude: 0
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

        const centerLocation = { ...userLocation };

        self.setState({ centerLocation, userLocation });
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
        const centerLocation = { ...userLocation };

        self.setState({ centerLocation, userLocation });
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
      <CardCont
        {...cardProps}
        closeHandler={() => this.setState({ selectedCard: null })}
      />
    );
    this.setState({ selectedCard });
  }

  _onChangeViewport(viewport) {
    const mapDim = {
      width: viewport.width,
      height: viewport.height
    };
    console.log('ON change viewport', viewport, 'viewport zoom', viewport.zoom);
    this.setState({ mapDim, mapZoom: viewport.zoom });
  }

  _userMove(pos) {
    const centerLocation = {
      longitude: pos.lngLat[0],
      latitude: pos.lngLat[1]
    };
    const userLocation = { ...centerLocation };
    // console.log('Pos', pos, 'centerLocation', centerLocation);

    this.setState({ centerLocation, userLocation });
  }

  gridSpan() {
    const { height, gridDim } = this.state;
    if (gridDim.height < height * 1 / 3) {
      return { span: 2, spanActive: 3 };
    }
    if (gridDim.height < height * 2 / 3) return { span: 4, spanActive: 5 };
    return { span: 6, spanActive: 7 };
  }
  render() {
    const { cards } = this.state;
    const {
      mapDim,
      centerLocation,
      mapZoom,
      gridDefDim,
      userLocation,
      selectedCard
    } = this.state;

    console.log('userLocation', userLocation, 'centerLocation', centerLocation);
    const mapViewport = { ...mapDim, ...centerLocation, zoom: mapZoom };
    return (
      <div>
        <Resizable
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
          defaultSize={gridDefDim}
          handleClasses={{ bottom: `${cx.handle}` }}
          handleSize={[30, 40]}
          onResizeStop={(e, direction, ref, d) => {
            this.setState(oldState => ({
              gridDim: {
                width: oldState.gridDim.width + d.width,
                height: oldState.gridDim.height + d.height
              },
              mapDim: {
                width: oldState.mapDim.width - d.width,
                height: oldState.mapDim.height - d.height
              }
            }));
          }}
        >
          <div className={`${cx.cardGridCont} `}>
            <Grid {...this.gridSpan()}>
              {cards.map(d =>
                <CardCont
                  {...d}
                  clickHandler={clicked => {
                    console.log(
                      'loc',
                      d.location,
                      'userLocation',
                      this.state.userLocation
                    );
                    this.setState(oldState => ({
                      centerLocation: !clicked
                        ? d.location
                        : { ...this.state.userLocation },
                      mapZoom: !clicked ? 20 : oldState.mapZoom,
                      selectedCard: d
                    }));
                  }}
                />
              )}
            </Grid>
          </div>
        </Resizable>

        <div style={{ position: 'relative' }}>
          <div className={`bg-1 text-center  text-white ${cx.handleBar}`}>
            <span className="align-middle">
              {' '}{selectedCard ? selectedCard.place : null}{' '}
            </span>
          </div>
          <AnimatedMap
            {...mapViewport}
            mapboxApiAccessToken={process.env.MapboxAccessToken}
            onChangeViewport={this._onChangeViewport}
            onClick={this._userMove}
            isDragging={false}
            startDragLngLat={null}
          >
            <CardOverlay
              {...mapViewport}
              cardClickHandler={this.cardClickHandler}
              cards={cards}
            />
            <UserOverlay {...mapViewport} location={userLocation} />
          </AnimatedMap>
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
