import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import styles from './index.scss';
// import cardIconSrc from '../utils/map-layers/cardIcon.svg';
import { Card } from '../cards';

import graph from './cardDataTest.json';
import { forceSimulation } from 'd3-force';

class Generator extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string
  };

  constructor(props) {
    super(props);
    console.log('simulation links', graph);
    const width = 2100;
    const height = 800;

    // Fix a sigle node
    /* const fixedNode = graph.nodes[0];
      fixedNode.fixed = true;
      fixedNode.x = width/5;
      fixedNode.y = height/3; */

    const simulation = d3
      .forceSimulation()
      .nodes(graph.nodes)
      .force(
        'link',
        d3.forceLink().links(graph.links).id(d => d.ID).distance(100)
      )
      .force('charge', d3.forceManyBody())
      // .force('link', d3.forceLink(graph.links))
      // .force('X', d3.forceX().x(function(d) { return d.x }))
      // .force('Y', d3.forceY().y(function(d) { return d.y }))
      .force('collide', d3.forceCollide().radius(12))
      .force('center', d3.forceCenter(width / 4, height / 2))
      // .on("tick", ticked)
      // .force('link')
      // .links(graph.links)
      .on('tick', () => {
        const nodes = graph.nodes;
        const links = graph.links;
        this.setState({ nodes, links });
      })
      .stop();

    // added

    d3.range(0, 200).forEach(() => simulation.tick());
    const nodes = simulation.nodes();
    const links = graph.links;
    this.state = { nodes, links, width, height, hovered: null };
  }

  render() {
    const { nodes, links, width, height, hovered } = this.state;
    const color = d3.scaleOrdinal(d3.schemeCategory10);
    return (
      <div className={styles.simulatorDiv}>
        <div style={{ position: 'relative' }} />
        <Form />
        <div style={{ width: '400px', height: '600px' }}>
          {hovered && <Card title={'Hassans card'} />}
        </div>

        <Graph
          width={width}
          height={height}
          nodes={nodes}
          links={links}
          color={color}
          hoverhandler={d => this.setState({ hovered: d })}
        />
      </div>
    );
  }
}

// const Card = ({ hovered }) =>
//   <div
//     style={{
//       position: 'absolute',
//       // bottom: '240',
//       width: '450px',
//       border: '7px solid #73AD21',
//       right: '0',
//       // left: graph.x,
//       // top: graph.y,
//       background: 'green',
//       paddingBottom: '10px',
//       paddingLeft: '10px'
//     }}
//   >
//     <div className={styles.cardTitle}>
//       <h1>Tickle Card</h1>
//     </div>
//     <strong> EXP: </strong>
//     <br />
//     <strong> ID: </strong>
//     {hovered.ID}
//     <br />
//     <strong> Title: </strong>
//     {hovered.title}
//     <br />
//     <strong> Location: </strong>
//     {JSON.stringify(hovered.location)}
//     <br />
//     <strong> Media: </strong>
//     {JSON.stringify(hovered.media)}
//     <br />
//     <strong> Next Card: </strong>
//     <br />
//     <strong> Date: </strong>
//     {hovered.date}
//     <br />
//     <strong> Tags: </strong>
//     {JSON.stringify(hovered.tags)}
//   </div>;

const Graph = ({ width, height, links, nodes, color, hoverhandler }) =>
  <svg width={width} height={height}>
    <g>
      <marker
        id="arrowhead"
        refX="13"
        refY="6"
        orient="auto"
        markerWidth="13"
        markerHeight="13"
      >
        <path d="M2, 2 L2,11 L10,6 L2, 2" />
      </marker>
      {links.map(d =>
        <line
          className={styles.link}
          x1={d.source.x}
          y1={d.source.y}
          x2={d.target.x}
          y2={d.target.y}
          markerEnd="url(#arrowhead)"
        />
      )}
    </g>
    <g>
      {nodes.map(d =>
        <g
          className={styles.node}
          transform={`translate(${d.x}, ${d.y})`}
          onClick={() => hoverhandler(d)}
          // onMouseLeave={() => hoverhandler(null)}
        >
          <circle r={10} fill={color(d.group)} />
        </g>
      )}
    </g>
  </svg>;

/* to do:
create 5 more cards --> OK
then create a graph of 10 nodes --> OK
map each card to a node --> OK
display onmouseover --> OK
use tooltips --> OK

After that, create a non-functional
UI for entering paramaters --> OK
*/

class Form extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string
  };

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={styles.base}>
        <form>
          <label>
            <strong>Number of cards:</strong>
          </label>
          <input
            className={styles.simulatorInput}
            type="text"
            name="nodes"
            title="nodes"
          />
          <br />
          <label>
            <strong>Number of cardsets:</strong>
          </label>
          <input
            className={styles.simulatorInput}
            type="text"
            name="links"
            title="links"
          />
          <br />
          <label>
            <strong>Select from cardsets:</strong>
          </label>
          <br />
          <label className={styles.simulatorRightSpace}>
            <input type="checkbox" name="university" value="" /> Culture
          </label>
          <label className={styles.simulatorRightSpace}>
            <input type="checkbox" name="culture" value="" /> Entertainment
          </label>
          <label className={styles.simulatorRightSpace}>
            <input type="checkbox" name="university" value="" /> Course
          </label>
          <label className={styles.simulatorRightSpace}>
            <input type="checkbox" name="culture" value="" /> Exams
          </label>
          <label className={styles.sim0ulatorRightSpace}>
            <input type="checkbox" name="university" value="" /> Sports
          </label>
          <label className={styles.simulatorRightSpace}>
            <input type="checkbox" name="culture" value="" /> Explore
          </label>
          <label className={styles.simulatorRightSpace}>
            <input type="checkbox" name="culture" value="" /> Reading
          </label>
          <label className={styles.simulatorRightSpace}>
            <input type="checkbox" name="culture" value="" /> Study Material
          </label>
          <br />
          <br />
          <label>
            <strong>Select from tags:</strong>
          </label>
          <br />
          <label className={styles.simulatorRightSpace}>
            <input type="checkbox" name="university" value="" /> University
          </label>
          <label className={styles.simulatorRightSpace}>
            <input type="checkbox" name="culture" value="" /> Sports
          </label>
          <label className={styles.simulatorRightSpace}>
            <input type="checkbox" name="university" value="" /> Culture
          </label>
          <label className={styles.simulatorRightSpace}>
            <input type="checkbox" name="culture" value="" /> Library
          </label>
          <label className={styles.simulatorRightSpace}>
            <input type="checkbox" name="university" value="" /> History
          </label>
          <label className={styles.simulatorRightSpace}>
            <input type="checkbox" name="culture" value="" /> Recreation
          </label>
          <label className={styles.simulatorRightSpace}>
            <input type="checkbox" name="university" value="" /> Nature
          </label>
          <label className={styles.simulatorRightSpace}>
            <input type="checkbox" name="culture" value="" /> Art
          </label>
          <label className={styles.simulatorRightSpace}>
            <input type="checkbox" name="university" value="" /> Architecture
          </label>
          <label className={styles.simulatorRightSpace}>
            <input type="checkbox" name="culture" value="" /> Tourism
          </label>
          <br />
          <br />
          <label>
            <strong>New tag(s). Seperate multiple tags with ";":</strong>
          </label>
          <input
            className={styles.simulatorInput}
            type="text"
            name="tags"
            title="tags"
          />
          <br />
          <label>
            <strong>Select location</strong>
          </label>
          <select>
            <option value="Evere">Evere</option>
            <option value="Elsene">Elsene</option>
            <option value="Brussel-Centrum">Brussel-Centrum</option>
            <option value="Etterbeek">Etterbeek</option>
          </select>
          <label>
            <strong>Distribution of the links:</strong>
          </label>
          <br />
          <form action="">
            <input type="radio" name="linkDistribution" value="Rabdom" /> Random<br />
            <input type="radio" name="linkDistribution" value="Manual" /> Manual
          </form>

          <br />
          <input
            className={styles.simulatorSubmit}
            type="submit"
            value="Enter"
          />
        </form>
      </div>
    );
  }
}

export default Generator;
