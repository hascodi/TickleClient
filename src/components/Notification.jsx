import React from 'react';
import { PropTypes } from 'react';

import css from './Notification.scss';
// import colorClasses from './colorClasses';

// const colorClass = () => colorScale(Math.random() * 30);

const Notfication = ({ width, height }) => (
  <div style={{ width: `${width}px`, height: `${height}px` }} className={css.ovalThoughtBorder}>
    <p>this is a message byy your teacher</p>
  </div>
);

Notfication.defaultProps = { width: 220, height: 160 };
Notfication.PropTypes = { width: PropTypes.number, height: PropTypes.number };

export default Notfication ;
