import React from 'react';
import PropTypes from 'prop-types';

// import cxx from './DragPreview.scss';
import cardIconSrc from '../../utils/map-layers/cardIcon.svg';

const CardDragPreview = ({ width, height, left, top, fill }) =>
  <img
    width={width}
    height={height}
    src={cardIconSrc}
    alt="icon"
    background={fill}
    style={{
      position: !(left === null || top === null) ? 'absolute' : null,
      border: '1px dashed gray',
      left: `${left}px`,
      top: `${top}px`
      // zIndex: 2000
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
  top: null,
  fill: 'transparent'
};

export default CardDragPreview;
