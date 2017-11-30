import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';

import styles from './index.scss';
import cardIconSrc from '../utils/map-layers/cardIcon.svg';

import graph from './exampleData.json';

class index extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string
  };

  constructor(props) {
    super(props);

    console.log('simulation links', graph);

    const width = 800;
    const height = 800;
    const simulation = d3
      .forceSimulation()
      .nodes(graph.nodes)
      .force('link', d3.forceLink(graph.links).id(d => d.id).distance(100))
      .force('charge', d3.forceManyBody())
      // .force('link', d3.forceLink(graph.links))
      .force('center', d3.forceCenter(width / 2, height / 2))
      // .on('tick', ticked)
      // .force('link')
      // .links(graph.links)
      .on('tick', () => {
        const nodes = graph.nodes;
        const links = graph.links;
        this.setState({ nodes, links });
      })
      .stop();

    d3.range(0, 200).forEach(() => simulation.tick());

    const nodes = simulation.nodes();
    const links = graph.links;

    this.state = { nodes, links, width, height };
  }

  render() {
    const { nodes, links, width, height } = this.state;
    return (
      <div className={`${styles.base} container `}>
        <svg width={width} height={height}>
          <g>
            {links.map(d =>
              <line
                className={styles.link}
                x1={d.source.x}
                y1={d.source.y}
                x2={d.target.x}
                y2={d.target.y}
              />
            )}
          </g>
          <g>
            {nodes.map(d =>
              <g transform={`translate(${d.x}, ${d.y})`}>
                <path
                  style={{ fill: '#E7ECED', stroke: '#424A60' }}
                  strokeWidth="2"
                  d="M46.5,5h-34c-1.1,0-2,0.9-2,2v50c0,1.1,0.9,2,2,2h34c1.1,0,2-0.9,2-2V7C48.5,5.9,47.6,5,46.5,5z"
                />

                <rect
                  x="17.4"
                  y="9"
                  style={{ fill: '#EFCE4A' }}
                  width="24"
                  height="18"
                />
                <path
                  style={{ fill: '#424A60' }}
                  d="M39.5,43h-20c-0.553,0-1-0.447-1-1s0.447-1,1-1h20c0.553,0,1,0.447,1,1S40.053,43,39.5,43z"
                />
                <path
                  style={{ fill: '#424A60' }}
                  d="M39.5,48h-20c-0.553,0-1-0.447-1-1s0.447-1,1-1h20c0.553,0,1,0.447,1,1S40.053,48,39.5,48z"
                />
                <path
                  style={{ fill: '#424A60' }}
                  d="M39.5,53h-20c-0.553,0-1-0.447-1-1s0.447-1,1-1h20c0.553,0,1,0.447,1,1S40.053,53,39.5,53z"
                />
              </g>
            )}
          </g>
        </svg>
      </div>
    );
  }
}

export default index;
