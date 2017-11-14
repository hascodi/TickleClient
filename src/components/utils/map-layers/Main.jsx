import Immutable from 'immutable';
import React from 'react';
import r from 'r-dom';

import MapGL from 'react-map-gl';
import rasterTileStyle from 'raster-tile-style';

import locations from 'example-cities';

import Overlay from './ExampleOverlay';

const tileSource = '//tile.stamen.com/toner/{z}/{x}/{y}.png';

const mapStyle = rasterTileStyle([tileSource]);


export default React.createClass({

  displayName: 'App',

  getInitialState: function getInitialState() {
    return {
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
        latitude: 0,
        longitude: 0,
        mapStyle: Immutable.fromJS(mapStyle),
        zoom: 1,
        isDragging: false
      }
    };
  },

  componentDidMount: function componentDidMount() {
    window.addEventListener('resize', () => {
      this.setState({
        viewport: Object.assign({}, this.state.viewport, {
          width: window.innerWidth,
          height: window.innerHeight
        })
      });
    });
  },

  _onChangeViewport: function _onChangeViewport(viewport) {
    this.setState({ viewport: Object.assign({}, this.state.viewport, viewport) });
  },

  render: function render() {
    return r.div([
      r(MapGL, Object.assign({}, this.state.viewport, {
        onChangeViewport: this._onChangeViewport
      }), [
        r(Overlay, Object.assign({}, this.state.viewport, { locations }))
      ])
    ]);
  }
});
