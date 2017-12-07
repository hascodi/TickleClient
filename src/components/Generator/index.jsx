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
        <input title="nodes" onClick={() => this.setState({ nodes: [] })} />
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
              <g
                transform={`translate(${d.x}, ${d.y})`}
                onClick={() => {
                  this.setState(oldState => ({
                    nodes: oldState.nodes.slice(1)
                  }));
                }}
              >
                <circle r={10} />
              </g>
            )}
          </g>
        </svg>
      </div>
    );
  }
}

export default index;
