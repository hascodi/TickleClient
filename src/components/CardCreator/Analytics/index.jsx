import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './index.scss';

class Analytics extends Component {
  static propTypes = {};

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={styles.base}>
        <h1>Analytics</h1>
      </div>
    );
  }
}

export default Analytics;
