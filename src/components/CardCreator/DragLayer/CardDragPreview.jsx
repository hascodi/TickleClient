import React from 'react';
import PropTypes from 'prop-types';

// import cxx from './DragPreview.scss';
import cardIconSrc from '../../utils/map-layers/cardIcon.svg';

const CardDragPreview = ({ width, height, left, top }) =>
  <img
    width={width}
    height={height}
    src={cardIconSrc}
    alt="icon"
    style={{
      position: !(left === null || top === null) ? 'absolute' : null,
      left: `${left}px`,
      top: `${top}px`
    }}
  />;

CardDragPreview.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  left: PropTypes.oneOf([null, PropTypes.number]),
  top: PropTypes.oneOf([null, PropTypes.number])
};

CardDragPreview.defaultProps = {
  width: 50,
  height: 50,
  left: null,
  top: null
};

export default CardDragPreview;
