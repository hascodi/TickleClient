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

// TODO:  change
dummyData.forEach((d, i) => {
  d.id = i;
});
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
    const width = window.innerWidth - 8; // TODO:factor out in container comp
    const defaultHeight = height / 2;
    const gridWidth = width * 2;
    const maxHeight = 3 / 4 * height;
    const minHeight = 1 / 4 * height;
    this.state = {
      height,
      width,
      defaultHeight,
      gridWidth,
      maxHeight,
      minHeight,
      mapHeight: height / 2,
      mapZoom: 20,
      gridHeight: height / 2,
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
    // window.addEventListener('resize', () => {
    //   this.setState({
    //     mapHeight: {
    //       width: window.innerWidth,
    //       height: window.innerHeight
    //     }
    //   });
    // });

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
      // 50.846749, 4.352349
      d => console.log('error watch pos', d),
      { timeout: 1000000 }
    );

    // const curPosId = navigator.geolocation.getCurrentPosition(
    //   pos => {
    //     console.log('cur pos', pos.coords);
    //     const userLocation = {
    //       latitude: pos.coords.latitude,
    //       longitude: pos.coords.longitude
    //     };
    //     const centerLocation = { ...userLocation };
    //
    //     self.setState({ centerLocation, userLocation });
    //   },
    //   d => console.log('error cur pos', d),
    //   { maximumAge: 0, enableHighAccuracy: true }
    // );

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
    const mapHeight = viewport.height;
    const width = viewport.width;

    console.log('ON change viewport', viewport, 'viewport zoom', viewport.zoom);
    this.setState({ mapHeight, width, mapZoom: viewport.zoom });
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
    const { height, gridHeight } = this.state;
    // console.log('gridSpan  height', height);
    if (gridHeight < height * 2 / 6) {
      return { columnWidth: 27, span: 2, activeSpan: 3, detail: false };
    }
    if (gridHeight < height * 3 / 6)
      return { columnWidth: 27, span: 3, activeSpan: 4, detail: false };
    if (gridHeight < height * 4 / 6)
      return { columnWidth: 27, span: 4, activeSpan: 5, detail: false };
    // if (gridHeight.height < height * 4 / 6)
    //   return { columnWidth: 27, span: 5, activeSpan: 7 };
    return { columnWidth: 27, span: 6, activeSpan: 8, detail: true };
  }
  render() {
    const { cards } = this.state;
    const {
      centerLocation,
      mapZoom,
      mapHeight,
      maxHeight,
      defaultHeight,
      gridHeight,
      minHeight,
      width,
      userLocation,
      selectedCard
    } = this.state;

    // console.log('width', mapDim);
    const mapDim = { width, height: mapHeight };
    // console.log('userLocation', userLocation, 'centerLocation', centerLocation);
    const mapViewport = { ...mapDim, ...centerLocation, zoom: mapZoom };
    const gridConfig = this.gridSpan();
    console.log('gridConfig', gridConfig);
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
          defaultSize={{ width, height: defaultHeight }}
          maxHeight={maxHeight}
          size={{ width, height: gridHeight }}
          handleClasses={{ bottom: `${cx.handle}` }}
          handleSize={[30, 40]}
          onResizeStop={(e, direction, ref, d) => {
            this.setState(oldState => ({
              gridHeight: oldState.gridHeight + d.height,
              mapHeight: oldState.mapHeight - d.height
            }));
          }}
        >
          <div className={`${cx.cardGridCont} `}>
            <Grid
              {...gridConfig}
              clickHandler={(c, selected) => {
                console.log('card', c);
                this.setState(oldState => ({
                  centerLocation: selected
                    ? c.location
                    : { ...this.state.userLocation },
                  mapZoom: selected ? 20 : oldState.mapZoom,
                  selectedCard: c,
                  gridHeight: selected ? maxHeight : defaultHeight,
                  mapHeight: selected ? minHeight : defaultHeight
                }));
              }}
            >
              {cards.map(d => <CardCont {...d} detail={false} />)}
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
