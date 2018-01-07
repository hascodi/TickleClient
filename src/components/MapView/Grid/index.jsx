import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import * as d3 from 'd3';
import VisibilitySensor from 'react-visibility-sensor';
import PropTypes from 'prop-types';

import { ScrollView, ScrollElement } from '../../utils/ScrollView';
import cx from './index.scss';

// function getCol(n) {
//   // return  (3 + (-1) ** n - 2 * n)/ 4 * 3;
//   return -3 * (3 + (-1) ** n - 2 * n) / 4;
// }

function getCol(i, n, span) {
  // const a = d3.range(0, n, span);
  // return d3.range(0, n).map(d => a[Math.floor(d / 2)]);
  // return [1, 1, 4, 4, 7, 7, 10, 10, 13, 13, 16, 16, 19, 19, 22, 22];
  const cols = d3.range(1, n * span, span);
  return cols[Math.floor(i / 2)]; // Math.floor(i / 2) + 1;
}

class Grid extends Component {
  static propTypes = {
    children: PropTypes.node,
    height: PropTypes.number,
    clickHandler: PropTypes.function,
    span: PropTypes.number,
    activeSpan: PropTypes.number,
    columnWidth: PropTypes.number,
    selected: PropTypes.string
  };

  static defaultProps = { selected: null };

  constructor(props) {
    super(props);
    this.scrollTo = this.scrollTo.bind(this);
  }


  componentDidUpdate() {
    const { children } = this.props;
    const selectedIndex = children.findIndex(d => d.props.selected);
    if (selectedIndex) this.scrollTo(selectedIndex);
  }

  scrollTo = name => {
    this._scroller.scrollTo(name);
  };

  render() {
    const { children, activeSpan, span, columnWidth } = this.props;

    return (
      <ScrollView ref={scroller => (this._scroller = scroller)}>
        <div
          className={cx.wrapper}
          style={{
            gridTemplateColumns: `repeat(${children.length *
              activeSpan}, ${columnWidth}px)`,
            gridTemplateRows: '50% 50%'
          }}
        >
          {React.Children.map(children, (comp, i) => {
            const col = getCol(i, children.length, span); // Math.floor(i / 2) + 1;
            const selectedComp = comp.props.selected;
            return (
              <VisibilitySensor
                offset={{
                  bottom: 0,
                  top: 0
                }}
              >
                {({ isVisible }) =>
                  <ScrollElement name={i}>
                    <Item
                      colSpan={selectedComp ? activeSpan : span}
                      rowSpan={selectedComp ? 2 : 1}
                      col={selectedComp ? col : null}
                      visible={isVisible}
                      index={i}
                    >
                      {comp}
                    </Item>
                  </ScrollElement>}
              </VisibilitySensor>
            );
          })}
        </div>
      </ScrollView>
    );
  }
}

Grid.defaultProps = {
  data: [],
  id: '0',
  height: 100,
  children: () => <div>test</div>,
  clickHandler: d => d,
  span: 3,
  activeSpan: 4,
  columnWidth: 35
};

class Item extends Component {
  static propTypes = {
    children: PropTypes.node,
    selected: PropTypes.bool,
    col: PropTypes.number,
    rowSpan: PropTypes.number,
    colSpan: PropTypes.number,
    opacity: PropTypes.number,
    visible: PropTypes.bool,
    clickHandler: PropTypes.func
  };

  static defaultProps = {
    clickHandler: d => d
  };

  render() {
    const {
      children,
      visible,
      opacity,
      colSpan,
      rowSpan,
      col,
      clickHandler,
      selected
    } = this.props;

    return (
      <div
        className={cx.item}
        style={{
          gridColumn: col ? `${col} / span ${colSpan}` : `span ${colSpan}`,
          gridRowEnd: `span ${rowSpan}`,
          opacity: visible || selected ? 1 : opacity
        }}
        onClick={() => !selected && clickHandler(children.props.id)}
      >
        {children}
      </div>
    );
  }
}

Item.defaultProps = {
  clicked: false,
  opacity: 0.56,
  colSpan: 1,
  rowSpan: 1,
  clickHandler: d => d,
  selected: false
};

export default Grid;
