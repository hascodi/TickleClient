import React, { PropTypes } from 'react';
import * as d3 from 'd3';
import _ from 'lodash';
import { forceSurface } from 'd3-force-surface';

import { Card } from './Card';

import styles from './CardStack.scss';

// function link(d) {
//   return `M${d.source.y},${d.source.x}C${(d.source.y + d.target.y) / 2},${d
//     .source.x} ${(d.source.y + d.target.y) / 2},${d.target.x} ${d.target.y},${d
//     .target.x}`;
// }

function diagonal(d) {
  return `M ${d.source.x} ${d.source.y}
            C ${(d.source.x + d.target.x) / 2} ${d.source.y},
              ${(d.source.x + d.target.x) / 2} ${d.target.y},
              ${d.target.x} ${d.target.y}`;
}

function outerRadius(d, orientation, offset = 5) {
  // Total difference in x and y from source to target
  const diffX = d.target.x - d.source.x;
  const diffY = d.target.y - d.source.y;

  // Length of path from center of source node to center of target node
  // const pathLength = Math.sqrt(diffX * diffX + diffY * diffY);

  // x and y distances from center to outside edge of target node
  // const srcOffX = diffX * d.source.r / pathLength;
  // const srcOffY = diffY * d.source.r / pathLength;
  // const tgtOffX = diffX * (d.target.r + offset) / pathLength;
  // const tgtOffY = diffY * (d.target.r + offset) / pathLength;
  if (orientation === 'horizontal')
    return [
      d.target.x,
      d.target.y + (d.source.first ? -d.target.r - offset : d.target.r + offset)
    ];
  return [
    d.target.x + (d.source.first ? -d.target.r - offset : d.target.r + offset),
    d.target.y
  ];
}

const Frame = props => {
  const pos = {};
  // if (props.orientation) {
  //   if (props.top) { pos = { left: `${props.pos}px` }; } else pos = { left: `${props.pos}px`, top: 100 };
  // } else if (props.vertical) {
  //   pos = { top: `${props.pos}px`, right: props.right ? 0 : null };
  // }

  const style = {
    opacity: 1,
    pointerEvents: 'auto',
    position: 'absolute',
    ...props.position
    // zIndex: z,
    // transform: `translate3d(${props.x}, ${props.y}px, ${props.z}px)`
    // left: `${props.x}px`,
  };
  const trans = {
    transition: `0.2s ${props.orientation
      ? 'left'
      : 'top'}, 0.2s background-position, 0.1s border-color`
  };

  return (
    <li
      className={styles.stack__item}
      style={{ ...style, ...pos, ...trans }}
      onClick={() => props.hoverHandler(props.index)}
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
  index: PropTypes.number.isRequired
};

Frame.defaultProps = {
  position: null,
  vertical: true,
  orientation: true,
  pos: 0,
  children: <Card />
};

class Stack extends React.Component {
  constructor(props) {
    super(props);
    const width = props.width;
    const height = props.height;
    const cardHeight = this.props.cardHeight;
    const cardWidth = this.props.cardWidth;

    const drawPath = d3
      .line()
      .curve(d3.curveBundle.beta(0.85))
      .curve(
        props.orientation === 'horizontal'
          ? d3.curveStepAfter
          : d3.curveStepBefore
      );

    let tagBox;
    if (props.orientation === 'horizontal') {
      tagBox = [
        {
          from: { x: 0, y: height / 2 - cardHeight / 2 },
          to: { x: width, y: height / 2 - cardHeight / 2 }
        },
        {
          from: { x: 0, y: height / 2 - cardHeight / 2 },
          to: { x: 0, y: height / 2 + cardHeight / 2 }
        },
        {
          from: { x: 0, y: height / 2 + cardHeight / 2 },
          to: { x: width, y: height / 2 + cardHeight / 2 }
        },
        {
          from: { x: width, y: height / 2 - cardHeight / 2 },
          to: { x: width, y: height / 2 + cardHeight / 2 }
        }
      ];
      // center = width - cardWidth / 2 -
    } else {
      tagBox = [
        {
          from: { x: width / 2 - width / 4, y: cardHeight / 2 },
          to: { x: width / 2 - width / 4, y: height - cardHeight / 2 }
        },
        {
          from: { x: width / 2 + width / 4, y: cardHeight / 2 },
          to: { x: width / 2 + width / 4, y: height - cardHeight / 2 }
        },
        {
          from: { x: width / 2 - width / 4, y: height - cardHeight / 2 },
          to: { x: width / 2 + width / 4, y: height - cardHeight / 2 }
        },
        {
          from: { x: width / 2 - width / 4, y: cardHeight / 2 },
          to: { x: width / 2 + width / 4, y: cardHeight / 2 }
        }
      ];
    }

    function aggregateByTags(data) {
      const spreadData = _.flatten(
        data.map(d =>
          d.tags.map(t => {
            const copy = _.cloneDeep(d);
            copy.tag = t;
            return copy;
          })
        )
      );
      return d3.nest().key(d => d.tag).entries(spreadData);
    }

    const allCards = props.firstCluster
      .map(d => {
        d.first = true;
        return d;
      })
      .concat(
        props.secCluster.map(d => {
          d.first = false;
          return d;
        })
      );

    const tags = aggregateByTags(allCards).map(d => {
      d.r = 10 + d.values.length * 10;
      d.tag = true;
      d.x = (width - d.r) / 2;
      d.y = height / 2;
      return d;
    });

    const links = _.flatten(
      allCards.map(c => {
        const targets = tags.filter(t => c.tags.includes(t.key));
        const l = targets.map(t => ({ order: c.first, source: c, target: t }));
        return l;
      })
    );

    const size =
      props.orientation === 'horizontal' ? props.width : props.height;

    const firstScale = d3
      .scaleBand()
      .domain(d3.range(0, this.props.firstCluster.length))
      .range([0, size]);

    const secScale = d3
      .scaleBand()
      .domain(d3.range(0, this.props.secCluster.length))
      .range([0, size]);

    const firstItems = props.firstCluster.map((c, i) => {
      let offset = 0;
      const focussedFrame = this.props.focussedFrame;
      if (focussedFrame && focussedFrame > i) offset = -props.focusFrameOffset;
      if (focussedFrame && focussedFrame < i) offset = props.focusFrameOffset;
      c.pos = firstScale(i) + offset;
      if (props.orientation === 'horizontal') {
        c.fx = c.pos;
      } else {
        c.fy = c.pos;
      }
      return c;
    });
    const secItems = props.secCluster.map((c, i) => {
      let offset = 0;
      const focussedFrame = this.props.focussedFrame;
      if (focussedFrame && focussedFrame > i) offset = -250;
      if (focussedFrame && focussedFrame < i) offset = 250;
      c.pos = secScale(i) + offset;
      if (props.orientation === 'horizontal') {
        c.fx = c.pos;
      } else {
        c.fy = c.pos;
      }
      return c;
    });

    this.state = { tags, tagBox, drawPath, links, firstItems, secItems };
  }

  componentDidMount() {
    const { tags, tagBox, links } = this.state;
    const { cardHeight, height } = this.props;
    const linksByKey = d3
      .nest()
      .key(d => d.target.key)
      .entries(links)
      .map(d => {
        d.sum = d.values.reduce((acc, e) => (e.source.first ? 1 : -1) + acc, 0);
        tags.find(e => e.key === d.key).sum = d.sum;
        return d;
      });
    console.log('linksByKey', linksByKey, 'tags', tags);

    console.log('links', links);
    const radOffset = 5;
    const simulation = d3
      .forceSimulation(tags)
      .force('collide', d3.forceCollide(d => d.r + radOffset).strength(0.4))
      // .alphaMin(0.2)
      // .force(
      //   'y',
      //   d3.forceY(d => height - cardHeight * d.sum / 10).strength(0.02)
      // )
      // d.values = d3.nest().key(e => e.source.first).entries(d.values);
      // .strength(0.01)
      // .force(
      //   'links',
      //   d3.forceLink(links).distance(cardHeight * 1.5).strength(0.01)
      // )
      // .force('bbox', forceContainer([[0, yOffset], [width, height - yOffset]]))
      .force(
        'container',
        forceSurface().surfaces(tagBox).oneWay(false).radius(d => d.r)
      )
      // .force('center', d3.forceCenter(width / 2, height / 2))
      .on('end', () => this.setState({ tags: simulation.nodes() }));
  }

  // shouldComponentUpdate() {
  //   return false;
  // }

  render() {
    const {
      cardHeight,
      cardWidth,
      focusFrameOffset,
      markerWidth,
      markerHeight
    } = this.props;
    const { tags, tagBox, drawPath, links, firstItems, secItems } = this.state;

    const FirstCluster = firstItems.map((ch, i) => {
      const position =
        this.props.orientation === 'horizontal'
          ? { left: `${ch.pos}px` }
          : { top: `${ch.pos}px` };
      return (
        <Frame
          {...this.props}
          z={firstItems.length - 1}
          position={position}
          hoverHandler={index => {
            this.props.hoverHandler(index);
          }}
          index={i}
        >
          {React.cloneElement(this.props.element, {
            width: this.props.cardWidth,
            height: this.props.cardHeight,
            ...ch
          })}
        </Frame>
      );
    });

    const SecCluster = secItems.map((ch, i) => {
      let position = { top: `${ch.pos}px`, right: 0 };
      if (this.props.orientation === 'horizontal') {
        position = {
          left: `${ch.pos}px`,
          top: `${this.props.height - cardHeight}px`
        };
      }

      return (
        <Frame
          {...this.props}
          z={secItems.length - i}
          position={position}
          hoverHandler={index => {
            this.props.hoverHandler(index);
          }}
          index={i}
        >
          {React.cloneElement(this.props.element, {
            width: this.props.cardWidth,
            height: this.props.cardHeight,
            ...ch
          })}
        </Frame>
      );
    });

    const svgStyle = {
      pointerEvents: 'none',
      width: `${this.props.width}px`,
      height: `${this.props.height}px`,
      left: 0,
      top: 0
    };

    const linkOffset = 20;
    let controlPoint;
    if (this.props.orientation === 'horizontal') {
      controlPoint = source => [
        source.x,
        source.y + (source.first ? linkOffset : -linkOffset)
      ];
    } else {
      controlPoint = source => [
        source.x + (source.first ? linkOffset : -linkOffset),
        source.y
      ];
    }
    return (
      <div
        style={{
          width: `${this.props.width}px`,
          height: `${this.props.height}px`
        }}
      >
        <ul className={`row ${styles.stack}`}>
          {this.props.firstCluster.length > 0
            ? FirstCluster
            : <div> No collected cards!</div>}
        </ul>
        <ul className={`row ${styles.stack}`}>
          {this.props.secCluster.length > 0
            ? SecCluster
            : <div> No collected cards!</div>}
        </ul>
        <svg style={svgStyle}>
          <defs>
            <marker
              id="end-arrow"
              viewBox="0 0 10 10"
              refX="0"
              refY="5"
              orient="auto"
              markerWidth={markerWidth}
              markerHeight={markerHeight}
            >
              <path strokeWidth="10" d="M0,0 L0,10 L10,5 z" />
            </marker>
          </defs>
          <g>
            {links.map(d => {
              let source;
              const target = d.target;
              if (this.props.orientation === 'vertical') {
                source = {
                  x: d.source.first ? cardWidth : this.props.width - cardWidth,
                  y: d.source.pos + cardHeight / 2,
                  first: d.source.first
                };
              } else {
                source = {
                  x: d.source.pos + cardWidth / 2,
                  y: d.source.first
                    ? cardHeight
                    : this.props.height - cardHeight,
                  first: d.source.first
                };
              }

              const cp = controlPoint(source);
              const centerX = [target.x, cp[1]];
              // const diffX = Math.abs(source.x - target.x);
              // const th = 40;
              // if (diffX < th) {
              //   console.log('hey');
              //   centerX = [source.x, cp[1]];
              // }

              // let centerY = [target.x, cp[1]];
              // const diffY = Math.abs(source.y - target.y);
              // if (diffY < th) {
              //   console.log('hey');
              //   centerY = [cp[0], source.y];
              // }
              //
              return (
                <path
                  markerEnd="url(#end-arrow)"
                  className={styles.bboxLine}
                  d={drawPath([
                    [source.x, source.y],
                    cp,
                    // centerX,
                    outerRadius(
                      { source, target },
                      this.props.orientation,
                      markerWidth * 2
                    )
                  ])}
                />
              );
            })}
          </g>
          <g>
            {tagBox.map(d =>
              <line
                className={styles.bboxLine}
                x1={d.from.x}
                y1={d.from.y}
                x2={d.to.x}
                y2={d.to.y}
              />
            )}
          </g>
          <g>
            {tags.map(t =>
              <g transform={`translate(${t.x}, ${t.y})`}>
                <circle r={t.r} fill="white" stroke="blue" />
                <text
                  textAnchor="middle"
                  stroke="#51c5cf"
                  strokeWidth="1px"
                  dy=".3em"
                >
                  {t.key}
                </text>
              </g>
            )}
          </g>
        </svg>
      </div>
    );
  }
}

Stack.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  cardWidth: PropTypes.number,
  cardHeight: PropTypes.number,
  focussedFrame: PropTypes.number,
  element: PropTypes.element,
  hoverHandler: PropTypes.func,
  orientation: PropTypes.bool,
  firstCluster: PropTypes.array,
  secCluster: PropTypes.array,
  focusFrameOffset: PropTypes.number,
  markerHeight: PropTypes.number,
  markerWidth: PropTypes.number
};

Stack.defaultProps = {
  firstCluster: [],
  secCluster: [],
  focussedFrame: null,
  element: null,
  hoverHandler: () => null,
  orientation: 'vertical',
  width: 800,
  height: 600,
  cardWidth: 150,
  cardHeight: 220,
  focusFrameOffset: 200,
  markerHeight: 6,
  markerWidth: 6
};

export default Stack;
