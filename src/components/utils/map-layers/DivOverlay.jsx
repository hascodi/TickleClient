import React from 'react';
import { Motion, spring } from 'react-motion';
import PropTypes from 'prop-types';
// import styles from './CardOverlay.scss';
// const window = require('global/window');
import HTMLOverlay from './div.react';
// import { HTMLOverlay } from 'react-map-gl';

import cardIconSrc from './cardIcon.svg';

function round(x, n) {
  const tenN = 10 ** n;
  return Math.round(x * tenN) / tenN;
}

// TODO

class DivOverlay extends React.Component {
  static propTypes = {
    // locations: React.PropTypes.array.isRequired,
    cardClickHandler: PropTypes.func.isRequired,
    data: PropTypes.array.isRequired,
    children: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),
    itemWidth: PropTypes.number,
    itemHeight: PropTypes.number,
    location: PropTypes.func,
    style: PropTypes.object
  };

  static defaultProps = { style: {} };

  constructor(props) {
    super(props);
    this.getDim = this.getDim.bind(this);
    this.redraw = this.redraw.bind(this);
  }

  getDim(childComp) {
    if (
      childComp.props.style &&
      childComp.props.style.width &&
      childComp.props.style.height
    ) {
      return [
        parseInt(childComp.props.style.width, 10),
        parseInt(childComp.props.style.height, 10)
      ];
    }
    if (childComp.width && childComp.height)
      return [childComp.props.width, childComp.props.height];
    return [this.props.itemWidth, this.props.itemHeight];
  }

  redraw(opt) {
    const { data, children } = this.props;
    return data.map(c => {
      // TODO
      const loc = [c.loc.longitude, c.loc.latitude];
      const pixel = opt.project(loc);
      const [x, y] = [round(pixel[0], 1), round(pixel[1], 1)];

      if (typeof children === 'function') {
        return children(c, [x, y], opt.unproject);
      }

      const [w, h] = this.getDim(children);
      const [cx, cy] = [x - w / 2, y - h / 2];
      return (
        <div
          key={c.key}
          style={{
            position: 'absolute',
            left: `${cx}px`,
            top: `${cy}px`,
            width: `${w}px`,
            height: `${h}px`,
            // cursor: 'pointer',
            transition: 'left 1s, top 1s'
            // zIndex: 1000
            // border: '2px black solid'
            // background: `url(${cardIconSrc})`
          }}
        >
          {children}
        </div>
      );
    });
  }

  render() {
    return <HTMLOverlay {...this.props} redraw={this.redraw} />;
  }
}

DivOverlay.defaultProps = {
  cardClickHandler: d => d,
  children: <div />,
  cards: [],
  itemHeight: 40,
  itemWidth: 30
  // location(c) {return }
};

const UserOverlay = props => {
  function redraw(opt) {
    const { longitude, latitude } = props.location;
    const pixel = opt.project([longitude, latitude]);
    return (
      <i
        style={{
          transform: `translate(${pixel[0]}px, ${pixel[1]}px)`
        }}
        className="fa fa-street-view fa-2x"
        aria-hidden="true"
      />
    );
  }
  return <HTMLOverlay {...props} redraw={redraw} />;
};

UserOverlay.propTypes = {
  location: React.PropTypes.object.isRequired
};

const CardOverlay = ({ ...mapViewport, cards, onClick }) =>
  <DivOverlay {...mapViewport} data={cards}>
    <CardMarker width={30} height={40} onClick={onClick} />
  </DivOverlay>;

CardOverlay.propTypes = {
  mapViewport: PropTypes.object.isRequired,
  cards: PropTypes.array.isRequired
};

const CardMarker = ({ width, height }) =>
  <img src={cardIconSrc} alt="icon" width={width} height={height} />;

CardMarker.propTypes = { width: PropTypes.number, height: PropTypes.number };
CardMarker.defaultProps = { width: 30, height: 40 };

const AnimMarker = ({
  key,
  width,
  height,
  selected,
  delay,
  x,
  y,
  children,
  onClick,
  preview
}) =>
  <div
    key={key}
    onClick={onClick}
    style={{
      position: 'absolute',
      left: selected ? `${0}px` : `${x - width / 2}px`,
      top: selected ? `${0}px` : `${y - height / 2}px`,
      width: `${width}px`,
      height: `${height}px`,
      transition: `left ${delay}s, top ${delay}s, width ${delay}s, height ${delay}s, opacity ${delay}s`,
      zIndex: selected ? 5000 : null
    }}
  >
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div
        style={{
          position: 'absolute',
          opacity: selected ? 0 : 1,
          width: '100%',
          height: '100%'
        }}
      >
        {preview}
      </div>
      <div
        className={ selected ? 'selectedCard' : null}
        style={{
          position: 'absolute',
          opacity: selected ? 1 : 0,
          transition: `left ${delay}s, top ${delay}s, width ${delay}s, height ${delay}s, opacity ${delay}s`,
          width: '100%',
          height: '100%'
        }}
      >
        {children}
      </div>
    </div>
  </div>;

AnimMarker.PropTypes = {
  delay: PropTypes.number,
  key: PropTypes.string,
  width: PropTypes.string,
  height: PropTypes.string,
  selected: PropTypes.bool,
  x: PropTypes.number,
  y: PropTypes.number,
  children: PropTypes.element,
  preview: PropTypes.children
};

AnimMarker.defaultProps = {
  delay: 0.5,
  preview: <CardMarker />
};

export { DivOverlay, UserOverlay, CardOverlay, CardMarker, AnimMarker };
