import React, { PropTypes, Component } from 'react';

import ViewportMercator from 'viewport-mercator-project';

export default class DivOverlay extends Component {

  static propTypes() {
    return {
      width: PropTypes.number.isRequired,
      height: PropTypes.number.isRequired,
      latitude: PropTypes.number.isRequired,
      longitude: PropTypes.number.isRequired,
      zoom: PropTypes.number.isRequired,
      redraw: PropTypes.func.isRequired,
      isDragging: PropTypes.bool.isRequired
    };
  }


  render() {
    const { width, height, isDragging } = this.props;
    const style = {
      pointerEvents: 'none',
      position: 'absolute',
      left: 0,
      top: 0,
      width: `${width}px`,
      height: `${height}px`,
      ...this.props.style
    };
    const mercator = ViewportMercator(this.props);
    const { project, unproject } = mercator;

    return (
      <div
        ref="overlay"
        style={style}
      >
        { this.props.redraw({ width, height, project, unproject, isDragging }) }
      </div>
    );
  }
}
