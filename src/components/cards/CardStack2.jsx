import React, { PropTypes } from 'react';
import * as d3 from 'd3';
import _ from 'lodash';
// import { forceContainer } from '../utils/helper';

import { CardMini } from './Card';
// import d3Sketchy from '../../lib/d3.sketchy';
// import SketchyCircle from './SketchyCircle';

import styles from './CardStack.scss';

// function link(d) {
//   return `M${d.source.y},${d.source.x}C${(d.source.y + d.target.y) / 2},${d
//     .source.x} ${(d.source.y + d.target.y) / 2},${d.target.x} ${d.target.y},${d
//     .target.x}`;
// }

// function diagonal(d) {
//   return `M ${d.source.x} ${d.source.y}
//             C ${(d.source.x + d.target.x) / 2} ${d.source.y},
//               ${(d.source.x + d.target.x) / 2} ${d.target.y},
//               ${d.target.x} ${d.target.y}`;
// }

class Label extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      width: 0,
      height: 0
    };
  }

  // componentDidMount() {
  //   const bbox = ReactDOM.findDOMNode(this).getBBox();
  //   const offset = 10;
  //   const width = bbox.width + offset;
  //   const height = bbox.height + offset;
  //
  //   // d3Sketchy().rectStroke({
  //   //   svg: d3.select(this.rect),
  //   //   x: width / 2,
  //   //   y: height / 2,
  //   //   width,
  //   //   height,
  //   //   density: 1,
  //   //   sketch: 3
  //   // });
  //   this.setState({ width, height });
  // }

  render() {
    const {
      mouseOver,
      mouseOut,
      bbox,
      hover,
      fontSize,
      x,
      y,
      children
    } = this.props;
    return (
      <div
        className={styles.tagLabel}
        onMouseOver={e => {
          e.stopPropagation();
          mouseOver(children);
        }}
        onMouseOut={e => {
          e.stopPropagation();
          mouseOut();
        }}
        style={{
          transform: `translate(${x - bbox.width / 2}px, ${y -
            bbox.height / 2}px)`,
          fontSize,
          zIndex: hover ? 1000 : 100 - fontSize,
          background: hover ? 'black' : 'white',
          color: hover ? 'white' : 'black'
        }}
      >
        {children}
      </div>
    );
  }
}

Label.propTypes = {
  children: PropTypes.string,
  hover: PropTypes.bool,
  bbox: PropTypes.object,
  fontSize: PropTypes.number,
  x: PropTypes.number,
  y: PropTypes.number,
  mouseOver: PropTypes.function,
  mouseOut: PropTypes.function
};

Label.defaultProps = {
  children: 'exampleText',
  fontSize: 10,
  bbox: { width: 0, height: 0 },
  x: 0,
  y: 0,
  mouseOver: () => null,
  mouseOut: () => null,
  hover: true
};

const Frame = props => {
  // if (props.orientation) {
  //   if (props.top) { pos = { left: `${props.pos}px` }; } else pos = { left: `${props.pos}px`, top: 100 };
  // } else if (props.vertical) {
  //   pos = { top: `${props.pos}px`, right: props.right ? 0 : null };
  // }

  const style = {
    opacity: props.highlighted ? 1 : 0.1,
    pointerEvents: 'auto',
    position: 'absolute',
    // zInde: props.hovered ? -100 : 100,
    ...props.position
    // transform: `translate3d(${props.x}, ${props.y}px, ${props.z}px)`
    // left: `${props.x}px`,
  };
  const trans = {
    transition: `0.2s top, 0.2s background-position, 0.1s border-color`
  };

  return (
    <li
      className={styles.stack__item}
      style={{ ...style, ...trans }}
      onMouseEnter={() => props.hoverHandler(props)}
      onMouseLeave={() => props.hoverHandler({ focussedFrame: null })}
    >
      {props.children}
    </li>
  );
};

Frame.propTypes = {
  position: PropTypes.string,
  orientation: PropTypes.bool,
  hoverHandler: PropTypes.func.isRequired,
  children: PropTypes.element,
  highlighted: PropTypes.bool,
  index: PropTypes.number.isRequired
};

Frame.defaultProps = {
  position: null,
  vertical: true,
  orientation: true,
  pos: 0,
  highlighted: false,
  children: <CardMini />
};

function layout(secCluster, focussedFrame, FrameOffset, size = 200) {
  console.log(
    'secCluster',
    secCluster,
    'focussedFrame',
    focussedFrame,
    'FrameOffset',
    FrameOffset,
    'size',
    size
  );
  const scale = d3
    .scaleLinear()
    .domain([0, secCluster.length - 1])
    .range([0, size]);

  const index = focussedFrame
    ? secCluster.findIndex(c => c.id === focussedFrame.id)
    : -1;

  console.log('FOUND', focussedFrame);
  if (index !== -1) {
    const xLeft = d3
      .scaleLinear()
      .domain([0, index - 1])
      .range([0, d3.max([scale(index) - FrameOffset / 2, 0])]);

    const xRight = d3
      .scaleLinear()
      .domain([index + 1, secCluster.length])
      .range([d3.min([scale(index) + FrameOffset, size]), size + FrameOffset]);

    return secCluster.map((c, i) => {
      c.highlighted = true;
      if (focussedFrame.index < i) {
        // c.highlighted = false;
        c.pos = xRight(i);
        c.hovered = false;
        // console.log('right', i, xRight(i));
      }
      // if (focussedFrame.index > i) {
      //   c.pos = xLeft(i);
      //   c.hovered = false;
      //   // c.highlighted = false;
      //   // console.log('left', i, c.fx);
      // }
      if (focussedFrame.index === i) {
        // console.log('right', i, xRight(i));
        c.hovered = true;
        c.pos = scale(i);
      }
      return c;
    });
  }
  return secCluster.map((c, i) => {
    c.pos = scale(i);
    c.highlighted = true;
    c.hovered = false;
    return c;
  });
}

class Stack extends React.Component {
  constructor(props) {
    super(props);
    const {
      firstCluster,
      FrameOffset,
      cardWidth,
      cardHeight,
      width,
      height
    } = props;

    const boxHeight = cardHeight * 1.3;
    // const cardHeight = this.props.cardHeight;

    const drawPath = d3
      .line()
      .curve(d3.curveBundle.beta(0.85))
      .curve(d3.curveStepAfter);

    let tagBox;
    if (props.orientation === 'horizontal') {
      tagBox = [
        {
          from: { x: 0, y: height / 2 - boxHeight / 2 },
          to: { x: width, y: height / 2 - boxHeight / 2 }
        },
        {
          from: { x: 0, y: height / 2 - boxHeight / 2 },
          to: { x: 0, y: height / 2 + boxHeight / 2 }
        },
        {
          from: { x: 0, y: height / 2 + boxHeight / 2 },
          to: { x: width, y: height / 2 + boxHeight / 2 }
        },
        {
          from: { x: width, y: height / 2 - boxHeight / 2 },
          to: { x: width, y: height / 2 + boxHeight / 2 }
        }
      ];
    } else {
      tagBox = [
        {
          from: { x: width / 2 - width / 4, y: boxHeight / 2 },
          to: { x: width / 2 - width / 4, y: height - boxHeight / 2 }
        },
        {
          from: { x: width / 2 + width / 4, y: boxHeight / 2 },
          to: { x: width / 2 + width / 4, y: height - boxHeight / 2 }
        },
        {
          from: { x: width / 2 - width / 4, y: height - boxHeight / 2 },
          to: { x: width / 2 + width / 4, y: height - boxHeight / 2 }
        },
        {
          from: { x: width / 2 - width / 4, y: boxHeight / 2 },
          to: { x: width / 2 + width / 4, y: boxHeight / 2 }
        }
      ];
    }

    const size = height - cardHeight;
    const cardData = layout(firstCluster, null, FrameOffset, size).map(d => {
      d.first = true;
      d.highlighted = true;
      return d;
    });

    this.state = {
      tagBox,
      drawPath,
      links: [],
      cardData,
      focussedFrame: null,
      size
    };
  }

  componentWillReceiveNewProps(nextProps) {
    const {
      firstCluster,
      FrameOffset,
      cardHeight,
      // cardHeight,
      width
    } = nextProps;

    // const size = width - cardHeight;
    const cardData = layout(firstCluster, null, FrameOffset, this.state.size).map(d => {
      d.first = true;
      d.highlighted = true;
      return d;
    });

    this.labels = {};
    this.setState({
      cardData
    });
  }

  hoverHandler(focussedFrame) {
    const { firstCluster, cardHeight} = this.props;


    const cardData = layout(firstCluster, focussedFrame, cardHeight, this.state.size);
    this.setState({ cardData });
  }

  render() {
    const { cardData } = this.state;

    const Items = cardData.map((ch, i) => {
      const position = { top: `${ch.pos}px` };

      return (
        <Frame
          {...ch}
          z={cardData.length - 1}
          position={position}
          hoverHandler={focussedFrame => {
            ::this.hoverHandler(focussedFrame);
          }}
          index={i}
        >
          {React.cloneElement(this.props.element, {
            width: this.props.cardWidth,
            height: this.props.cardHeight,
            // img: ch.images[0].resource_url,
            ...ch
          })}
        </Frame>
      );
    });

    return (
      <div
        style={{
          width: `${this.props.width}px`,
          height: `${this.props.height}px`
          // overflow: 'hidden'
        }}
      >
        <ul className={`row ${styles.stack}`}>
          {Items}
        </ul>
      </div>
    );
  }

  // <text
  //   textAnchor="middle"
  //   stroke="#51c5cf"
  //   strokeWidth="1px"
  //   dy=".3em"
  //   style={{ fontSize: '15px', stroke: 'black' }}
  // >
  //   {t.key}
  // </text>
}

Stack.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  cardWidth: PropTypes.number,
  cardHeight: PropTypes.number,
  element: PropTypes.element,
  orientation: PropTypes.bool,
  firstCluster: PropTypes.array,
  secCluster: PropTypes.array,
  FrameOffset: PropTypes.number
};

Stack.defaultProps = {
  firstCluster: [],
  secCluster: [],
  focussedFrame: null,
  element: <CardMini />,
  orientation: 'vertical',
  width: 800,
  height: 600,
  cardWidth: 150,
  cardHeight: 200,
  FrameOffset: 200,
  markerHeight: 6,
  markerWidth: 0
};

export default Stack;
