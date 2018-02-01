/* eslint no-use-before-define: ["error", { "classes": false }] */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import styles from './index.scss';
// import cardIconSrc from '../utils/map-layers/cardIcon.svg';
import { Card } from '../cards';

import graph from './cardDataTest.json';
import titles from './cardTitles.json';
import descriptions from './cardDescriptions.json';
import images from './cardImages.json';
import { forceSimulation } from 'd3-force';

let random = 0;
const tagCheckboxes = [];
// let myFormData;

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

    this.onSubmit = this.onSubmit.bind(this);

    d3.range(0, 200).forEach(() => simulation.tick());
    const nodes = simulation.nodes();
    const links = graph.links;
    this.state = {
      nodes,
      links,
      width,
      height,
      hovered: null,
      myFormData: '',
      explore: ['leeg'] // added this
    };
  }

  // added this
  onSubmit(formData) {
    const newArr = this.state.explore.slice();
    if (JSON.stringify(this.state.explore) === 'true') {
      newArr.push('explore');
      // button = <LogoutButton onClick={this.handleLogoutClick} />;
    } else {
      alert(`else alert`);
    }

    this.setState({ explore: newArr }); // {}
    alert(`Formdata Above: ${JSON.stringify(this.state.explore)}`);
  }

  /* onSubmit = formData => {
    this.setState({
      numberOfNodes: formData
    });
  }; */
  render() {
    const { nodes, links, width, height, hovered } = this.state;
    const color = d3.scaleOrdinal(d3.schemeCategory10);
    return (
      <div className={styles.simulatorDiv}>
        <div style={{ position: 'relative' }} />
        <Form onSubmit={this.onSubmit} />
        <div style={{ width: '400px', height: '600px' }}>
          {hovered && (
            <Card
              title={titles[random]}
              tags={this.state.explore}
              description={descriptions[random]}
              img={images[random]}
            /> // added this
          )}
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

const options = ['Brussel-Centrum', 'Elsene', 'Etterbeek', 'Evere'];

/* const CardGenerator = function(props) {
  return <p>The logged in user is: {props.Graph.links}</p>;
  

}; */

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
      explore: true,
      entertainment: true,
      reading: true,
      culture: false,
      art: true,
      music: false,
      value: 'Select a Location',
      random: '',
      myFormData: '' // added this
      /* tagCheckboxes: [
        this.state.europeancomposers,
        this.state.testseries,
        this.state.pirateset
      ], */
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this); // event for the submission of the form
  }

  handleInputChange(event) {
    this.props.onSubmit(this.state.explore); // added this
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  // handlesubmit event of the submit button of the form (Enter)
  handleSubmit(event) {
    random = Math.floor(Math.random() * 10 + 1);
    /* for (let i = 0; i < this.state.tagCheckboxes.length; i++) {
      {
        taglist[i] = tagCheckboxes[i] ? [tagCheckboxes[i].name] : 'false';
      }
    } */
    alert(`Data: ${JSON.stringify(this.state)}`);
    event.preventDefault();
  }

  render() {
    // definieer een variabele die door de Generator component zal worden gebruikt
    // const taglist = ['testtaglist'];
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
          Cardsets:
          <div>
            <input
              type="checkbox"
              name="explore"
              id="explore"
              checked={this.state.explore}
              onChange={this.handleInputChange}
            />
            <label htmlFor="explore" className={styles.simulatorRightSpace}>
              Explore
            </label>
            <input
              type="checkbox"
              name="entertainment"
              id="entertainment"
              checked={this.state.entertainment}
              onChange={this.handleInputChange}
            />
            <label
              htmlFor="entertainment"
              className={styles.simulatorRightSpace}
            >
              Entertainment
            </label>
            <input
              type="checkbox"
              name="reading"
              id="reading"
              checked={this.state.reading}
              onChange={this.handleInputChange}
            />
            <label htmlFor="reading" className={styles.simulatorRightSpace}>
              Reading
            </label>
          </div>
          Tags:
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
            <label htmlFor="location">
              Select a Location
              <select
                id="location"
                name="value"
                value={this.state.value}
                onChange={this.handleInputChange}
                className="form-control"
              >
                {options.map(option => (
                  <option value={option} name={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
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
