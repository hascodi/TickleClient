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

  componentDidMount() {
    // $(ReactDOM.findDOMNode(this)).carousel({ ride: 'pause', interval: false });
    //
    // scrollToComponent(this.Violet);
    //            scrollTo();
    // this.forceUpdate();
  }

  componentDidUpdate() {
    const { selected } = this.props;
    if (selected) this._scroller.scrollTo(selected);
  }

  // shouldComponentUpdate(nextProps) {
  //   const { height, children } = this.props;
  //   if (
  //     height !== nextProps.height ||
  //     children.length !== nextProps.children.length
  //   )
  //     return true;
  //   return false;
  // }
  scrollTo = name => {
    this._scroller.scrollTo(name);
  };

  // cardClickHandler(d) {
  //   this.props.clickHandler(d);
  // }

  render() {
    const { children, activeSpan, span, columnWidth, selected } = this.props;
    // return (
    //   <div className={cx.wrapper}>
    //     {React.Children.map(children, (comp, i) => comp)}
    //   </div>
    // );
    //
    //
    // const scrollTo = name => {
    //   console.log('this', this);
    //   this._scroller.scrollTo(name);
    // };

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
                      {...this.props}
                      selected={selected === comp.props.id}
                      defaultCol={col}
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
  id: 'carouselExampleIndicators',
  height: 100,
  children: () => <div>test</div>,
  clickHandler: PropTypes.function,
  span: 3,
  activeSpan: 4,
  columnWidth: 35
};

class Item extends Component {
  static propTypes = {
    children: PropTypes.node,
    selected: PropTypes.bool,
    defaultCol: PropTypes.number,
    span: PropTypes.number,
    activeSpan: PropTypes.number,
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
      defaultCol,
      visible,
      opacity,
      span,
      activeSpan,
      clickHandler,
      selected
    } = this.props;

    return (
      <div
        className={cx.item}
        style={{
          height: '100%',
          gridColumn: selected
            ? `${defaultCol} / span ${activeSpan}`
            : `span ${span}`,
          gridRowEnd: selected ? 'span 2' : 'span 1',
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
  span: 1,
  activeSpan: 2,
  clickHandler: d => d,
  selected: false
};

export default Grid;
