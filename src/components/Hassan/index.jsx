import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './index.scss';

class index extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string
  };

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={`${styles.base} container `}>
        <h1> Hey Hassan</h1>
        <p>
          If you see this you already managed to set up the project. It is
          important that you get used to React. Please check out the tutorials{' '}
          <a
            className="badge badge-primary"
            href="https://github.com/enaqx/awesome-react"
          >
            here
          </a>. There are a lot, just try out some stuff. if You need a map,
          look into{' '}
          <a
            className="badge badge-primary"
            href="https://github.com/uber/react-map-gl"
          />
          React Map GL! At some point also{' '}
          <a className="badge badge-secondary" href="https://d3js.org/">
            D3
          </a>{' '}
          might come in handy. Especially,{' '}
          <a
            className="badge badge-success"
            href="http://blockbuilder.org/search"
          >
            Blockbuilders
          </a>{' '}
          is a great site for finding visualization examples
        </p>
        <p>
          {' '}Next week we will check out the data for the cards together! I
          still need to generate some example data which is time consuming.
          Maybe we can bundle forces!
        </p>
      </div>
    );
  }
}

export default index;
