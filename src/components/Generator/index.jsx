/* eslint no-use-before-define: ["error", { "classes": false }] */

import React, { Component } from 'react';
import PropTypes, { bool } from 'prop-types';
import * as d3 from 'd3';
import styles from './index.scss';
// import cardIconSrc from '../utils/map-layers/cardIcon.svg';
import { Card } from '../cards';

import graph from './cardDataTest.json';
import titles from './cardTitles.json';
import descriptions from './cardDescriptions.json';
import tagmappings from './cardMappingTags.json';
import images from './cardImages.json';
import linkedCards from './cardLinks.json';
import { forceSimulation } from 'd3-force';

let random = 0;
const tagCheckboxes = [];
let tagArrayLen = 0;

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
      myCardSetsFormData: [],
      myTagsFormData: [],
      explore: [],
      // newArr: [],
      exists: true,
      newArr2: [],
      tagVar: 0
    };
  }

  onSubmit(cardSetsData, tagsData) {
    // const newArr = this.state.explore.slice();
    // const stringexp = JSON.stringify(cardSetsData);
    // newArr.push(cardSetsData);
    // this.setState({ explore: newArr }); // {}
    this.setState({ myCardSetsFormData: cardSetsData });
    this.setState({ myTagsFormData: tagsData });
    // this.setState({ newArr2: newArr });

    const newArr = [];

    for (let i = 0; i < tagmappings.tagged.length; i++) {
      let counter = 0;
      if (tagmappings.tagged[i].length === tagsData.length) {
        for (let j = 0; j < tagsData.length; j++) {
          if (tagsData[j] === tagmappings.tagged[i][j]) {
            counter++;
          }
        }
        if (counter === tagsData.length) {
          newArr.push(i);
        }
      }
    }
    tagArrayLen = newArr.length;
    this.setState({ tagVar: newArr[random] });
    // alert(`Formdata Above: ${JSON.stringify(tagArrayLen)}`); // this.state.myTagsFormData
  }
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
              title={titles[this.state.tagVar]}
              tags={tagmappings.tagged[this.state.tagVar]}
              cardSets={this.state.myCardSetsFormData}
              description={descriptions[this.state.tagVar]}
              img={images[this.state.tagVar]}
              linkedCards={linkedCards.links[this.state.tagVar]}
            />
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

// const options = ['Brussel-Centrum', 'Elsene', 'Etterbeek', 'Evere'];

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
      explore: false,
      entertainment: false,
      reading: false,
      culture: false,
      art: false,
      education: false,
      // hideTags: true,
      // value: 'Select a Location',
      random: '',
      myCardSetsFormData: '',
      sendThisCardSetsArray: [],
      sendThisTagsArray: [],
      testArray: []
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleInputChange(event) {
    this.setState({ sendThisCardSetsArray: [] }); // empty the array after early submission
    this.setState({ sendThisTagsArray: [] }); // idem for this array
    const newCardSetsArray = [];
    if (this.state.explore) {
      newCardSetsArray.push('explore');
    }
    if (this.state.entertainment) {
      newCardSetsArray.push('entertainment');
    }
    if (this.state.reading) {
      newCardSetsArray.push('reading');
    }
    this.setState({ sendThisCardSetsArray: newCardSetsArray });

    const newTagsArray = [];
    if (this.state.art && !this.state.entertainment && !this.state.reading) {
      newTagsArray.push('art');
    }
    if (this.state.culture && !this.state.reading) {
      newTagsArray.push('culture');
    }
    if (
      this.state.education &&
      !this.state.explore &&
      !this.state.entertainment
    ) {
      newTagsArray.push('education');
    }
    this.setState({ sendThisTagsArray: newTagsArray });

    this.props.onSubmit(
      this.state.sendThisCardSetsArray,
      this.state.sendThisTagsArray
    );

    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  handleSubmit(event) {
    random = Math.floor(Math.random() * tagArrayLen);
    // alert(`Data: ${JSON.stringify(this.state)}`);
    event.preventDefault();
  }

  render() {
    return (
      <div className={styles.base}>
        <form onSubmit={this.handleSubmit}>
          <div> Card Generator for the Tickle Game </div>
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
              hidden={
                (!this.state.explore || !this.state.entertainment) &&
                this.state.reading
              }
            />
            <label
              htmlFor="culture"
              hidden={
                (!this.state.explore || !this.state.entertainment) &&
                this.state.reading
              }
              className={styles.simulatorRightSpace}
            >
              Culture
            </label>
            <input
              type="checkbox"
              name="art"
              id="art"
              checked={this.state.art}
              onChange={this.handleInputChange}
              hidden={
                !this.state.explore &&
                (this.state.entertainment || this.state.reading)
              }
            />
            <label
              htmlFor="art"
              hidden={
                !this.state.explore &&
                (this.state.entertainment || this.state.reading)
              }
              className={styles.simulatorRightSpace}
            >
              Art
            </label>
            <input
              type="checkbox"
              name="education"
              id="education"
              checked={this.state.education}
              onChange={this.handleInputChange}
              hidden={
                !this.state.reading &&
                (this.state.entertainment || this.state.explore)
              }
            />
            <label
              htmlFor="education"
              hidden={
                !this.state.reading &&
                (this.state.entertainment || this.state.explore)
              }
              className={styles.simulatorRightSpace}
            >
              Education
            </label>
          </div>
          <div className="form-group" />
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
