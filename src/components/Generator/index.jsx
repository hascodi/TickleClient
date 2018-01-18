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
        d3
          .forceLink()
          .links(graph.links)
          .id(d => d.ID)
          .distance(100)
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

const Graph = ({ width, height, links, nodes, color, hoverhandler }) => (
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
      {links.map(d => (
        <line
          className={styles.link}
          x1={d.source.x}
          y1={d.source.y}
          x2={d.target.x}
          y2={d.target.y}
          markerEnd="url(#arrowhead)"
        />
      ))}
    </g>
    <g>
      {nodes.map(d => (
        <g
          className={styles.node}
          transform={`translate(${d.x}, ${d.y})`}
          onClick={() => hoverhandler(d)}
          // onMouseLeave={() => hoverhandler(null)}
        >
          <circle r={10} fill={color(d.group)} />
        </g>
      ))}
    </g>
  </svg>
);

/* to do:
create 5 more cards --> OK
then create a graph of 10 nodes --> OK
map each card to a node --> OK
display onmouseover --> OK
use tooltips --> OK

After that, create a non-functional
UI for entering paramaters --> OK
*/

/* const CardGenerator = function(props) {
  return <p>The logged in user is: {props.Graph.links}</p>;
}; */

const options = [
  'Select an Option',
  'Brussel-Centrum',
  'Elsene',
  'Etterbeek',
  'Evere'
];

class Form extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string
  };

  constructor(props) {
    super(props);

    this.state = {
      numberOfNodes: '',
      newCardset: '',
      europeancomposers: false,
      testseries: false,
      pirateset: false,
      culture: false,
      art: false,
      music: false,
      value: 'Select an Option'
    };
    this.handleSubmit = this.handleSubmit.bind(this); // event for the submission of the form
    this.onChange = this.onChange.bind(this); // binding onchange manually in the constructor
    this.handleInputChange = this.handleInputChange.bind(this);
  }
  
  // onchange event of the selectbox of location
  onChange(event) {
    this.setState({
      value: event.target.value
    });
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  // handlesubmit event of the submit button of the form
  handleSubmit(event) {
    event.preventDefault();
    const data = new FormData(event.target);
    alert(`Data: ${this.state.value}`);    

    fetch('/api/form-submit-url', {
      method: 'POST',
      body: data
    });
  }

  render() {
    return (
      <div className={styles.base}>
        <form onSubmit={this.handleSubmit}>
          <div>
            <label htmlFor="inputcards">Number of Cards</label>
            <input
              className={styles.simulatorInput}
              type="text"
              name="numberOfNodes"
              title="nodes"
              id="inputcards"
              value={this.state.numberOfNodes}
              onChange={this.handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="inputnewcardset">New Cardset</label>
            <input
              className={styles.simulatorInput}
              type="text"
              name="newCardset"
              title="newCardset"
              id="inputnewcardset"
              value={this.state.newCardset}
              onChange={this.handleInputChange}
            />
          </div>
          Select cardsets:
          <div>
            <input
              type="checkbox"
              name="europeancomposers"
              id="europeancomposers"
              checked={this.state.europeancomposers}
              onChange={this.handleInputChange}
            />
            <label
              htmlFor="europeancomposers"
              className={styles.simulatorRightSpace}
            >
              european composers
            </label>
            <input
              type="checkbox"
              name="testseries"
              id="testseries"
              checked={this.state.testseries}
              onChange={this.handleInputChange}
            />
            <label htmlFor="testseries" className={styles.simulatorRightSpace}>
              testseries
            </label>
            <input
              type="checkbox"
              name="pirateset"
              id="pirateset"
              checked={this.state.pirateset}
              onChange={this.handleInputChange}
            />
            <label htmlFor="pirateset" className={styles.simulatorRightSpace}>
              pirateset
            </label>
          </div>
          Select tags:
          <div>
            <input
              type="checkbox"
              name="culture"
              id="culture"
              checked={this.state.culture}
              onChange={this.handleInputChange}
            />
            <label htmlFor="culture" className={styles.simulatorRightSpace}>
              Culture
            </label>
            <input
              type="checkbox"
              name="art"
              id="art"
              checked={this.state.art}
              onChange={this.handleInputChange}
            />
            <label htmlFor="art" className={styles.simulatorRightSpace}>
              Art
            </label>
            <input
              type="checkbox"
              name="music"
              id="music"
              checked={this.state.music}
              onChange={this.handleInputChange}
            />
            <label htmlFor="music" className={styles.simulatorRightSpace}>
              Music
            </label>
          </div>
          <div className="form-group">
            <select
              value={this.state.value}
              // onChange={this.handleInputChange}
              onChange={this.onChange}
              className="form-control"
            >
              {options.map(option => (
                <option value={option} name={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
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

