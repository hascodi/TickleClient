import React, { Component } from 'react';
import * as d3 from 'd3';
// import ReactDOM from 'react-dom';

// import VisibilitySensor from 'react-visibility-sensor';
import PropTypes from 'prop-types';

import cx from './index.scss';

// function getCol(n) {
//   // return  (3 + (-1) ** n - 2 * n)/ 4 * 3;
//   return -3 * (3 + (-1) ** n - 2 * n) / 4;
// }

function getCol(i, n, span) {
  const cols = d3.range(1, n * span, span);
  return cols[Math.floor(i / 3)]; // Math.floor(i / 2) + 1;
}

class Grid extends Component {
  static propTypes = {
    children: PropTypes.node,
    height: PropTypes.number,
    clickHandler: PropTypes.function,
    span: PropTypes.number,
    activeSpan: PropTypes.number,
    cols: PropTypes.number,
    gap: PropTypes.number,
    rows: PropTypes.number
  };

  constructor(props) {
    super(props);
    this.cardClickHandler = this.cardClickHandler.bind(this);
    this.state = { selected: null };
  }

  componentDidMount() {
    // $(ReactDOM.findDOMNode(this)).carousel({ ride: 'pause', interval: false });
  }

  // componentDidUpdate() {}

  // shouldComponentUpdate(nextProps) {
  //   const { height, children } = this.props;
  //   if (
  //     height !== nextProps.height ||
  //     children.length !== nextProps.children.length
  //   )
  //     return true;
  //   return false;
  // }

  cardClickHandler(d) {
    this.props.clickHandler(d);
  }

  render() {
    const {
      children,
      activeSpan,
      span,
      // columns,
      style,
      cols,
      gap,
      rows
    } = this.props;

    // const gap = 1;
    const columnWidth = (100 - cols * gap + 1) / cols;
    const rowHeight = 100 / rows;

    const gridTemplateRows = `repeat(${rows}, ${Math.floor(rowHeight)}%)`;

    // return (
    //   <div className={cx.wrapper}>
    //     {React.Children.map(children, (comp, i) => comp)}
    //   </div>
    // );
    //
    //
    return (
      <div
        className={cx.wrapper}
        style={{
          width: '100%',
          height: '100%',
          gridTemplateColumns: `repeat(${cols}, ${columnWidth}%)`,
          gridGap: `${gap}%`,
          transition: 'width 2s, height 2s',
          gridTemplateRows,
          ...style
          // alignItems: 'end'
        }}
      >
        {React.Children.map(children, comp => comp)}
      </div>
    );
  }
}

Grid.defaultProps = {
  data: [],
  id: 'carouselExampleIndicators',
  children: () => <div>test</div>,
  span: 3,
  activeSpan: 2,
  columns: 4,
  gap: 10,
  rows: 3,
  style: {}
};

class Cell extends Component {
  static propTypes = {
    children: PropTypes.node,
    selected: PropTypes.bool,
    defaultCol: PropTypes.number,
    span: PropTypes.number,
    activeSpan: PropTypes.number,
    opacity: PropTypes.number,
    clickHandler: PropTypes.function
  };

  constructor(props) {
    super(props);
  }

  render() {
    const { children, span } = this.props;

    return (
      <div
        style={{
          transition: 'width 2s, height 2s',
          gridColumn: `span ${span}`,
          gridRowEnd: 'span 1'
        }}
      >
        {children}
      </div>
    );
  }
}

Cell.defaultProps = {
  clicked: false,
  opacity: 0.56,
  span: 1,
  activeSpan: 2,
  clickHandler: d => d,
  selected: null,
  children: d =>
    <div>
      {d}
    </div>,
  defaultCol: 1
};

export default Grid;
