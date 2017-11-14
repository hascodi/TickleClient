import React from 'react';
import { Motion, spring } from 'react-motion';
// import styles from './CardOverlay.scss';
// const window = require('global/window');
import DIVOverlay from './div.react';

function round(x, n) {
  const tenN = Math.pow(10, n);
  return Math.round(x * tenN) / tenN;
}

class ChalllengesOverlay extends React.Component {
  static propTypes() {
    return {
      // locations: React.PropTypes.array.isRequired,
      cardClickHandler: React.PropTypes.func.isRequired,
      data: React.PropTypes.array.isRequired
    };
  }

  redraw(opt) {
    const { data, children, elWidth, elHeight } = this.props;
    console.log('children', children);
    return data.map(c => {
      const loc = [c.location.longitude, c.location.latitude];
      const pixel = opt.project(loc);
      const pixelRounded = [round(pixel[0], 1), round(pixel[1], 1)];
      const [w, h] = [children.props.width, children.props.height];
      return (
        <Motion
          style={{
            x: spring(pixelRounded[0]),
            y: spring(pixelRounded[1])
          }}
        >
          {({ x, y }) =>
            <div
              key={c.key}
              style={{
                position: 'absolute',
                left: `${x - elWidth / 2}px`,
                top: `${y - elHeight / 2}px`,
                width: `${w || elWidth}px`,
                height: `${h || elHeight}px`,
                cursor: 'pointer'
                // border: '2px black solid'
                // background: `url(${cardIconSrc})`
              }}
            >
              {children}
            </div>}
        </Motion>
      );
    });
  }

  render() {
    return <DIVOverlay {...this.props} redraw={this.redraw.bind(this)} />;
  }
}

ChalllengesOverlay.defaultProps = {
  cardClickHandler: d => d,
  cards: [],
  elHeight: 40,
  elWidth: 30
};

export default ChalllengesOverlay;
