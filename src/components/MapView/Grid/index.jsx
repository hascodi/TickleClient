import React, { Component } from 'react';
// import ReactDOM from 'react-dom';

import VisibilitySensor from 'react-visibility-sensor';
import PropTypes from 'prop-types';

import cx from './index.scss';

class Grid extends Component {
  static propTypes = {
    children: PropTypes.node,
    height: PropTypes.number,
    // clickHandler: PropTypes.function,
    span: PropTypes.number
  };

  // constructor(props) {
  //   super(props);
  // }

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

  render() {
    const { children } = this.props;
    // return (
    //   <div className={cx.wrapper}>
    //     {React.Children.map(children, (comp, i) => comp)}
    //   </div>
    // );
    return (
      <div className={cx.wrapper}>
        {React.Children.map(children, (comp, i) => {
          const col = i % 2 === 0 ? i + 1 : i;
          // if (i === children.length - 1 || i === children.length - 2) {
          //   col -= 1;
          // }
          // const VisibilityOffset =
          //   i === children.length - 1 || i === children.length - 2 ? -1 : 90;
          return (
            <VisibilitySensor
              offset={{
                // left: i === 0 ? 0 : 20,
                // right: VisibilityOffset,
                bottom: 0,
                top: 0
              }}
            >
              {({ isVisible }) =>
                <Item
                  defaultCol={col}
                  visible={isVisible}
                  clickHandler={comp.props.clickHandler}
                  {...this.props}
                >
                  {comp}
                </Item>}
            </VisibilitySensor>
          );
        })}
      </div>
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
  spanActive: 4
};

class Item extends Component {
  static propTypes = {
    children: PropTypes.node,
    clicked: PropTypes.bool,
    defaultCol: PropTypes.number,
    span: PropTypes.number,
    spanActive: PropTypes.number,
    opacity: PropTypes.number,
    visible: PropTypes.bool,
    clickHandler: PropTypes.function
  };

  constructor(props) {
    super(props);
    const { clicked } = props;
    this.state = { clicked };
  }

  render() {
    const {
      children,
      defaultCol,
      visible,
      opacity,
      clickHandler,
      span,
      spanActive
    } = this.props;
    const { clicked } = this.state;

    return (
      <div
        className={cx.item}
        style={{
          height: '100%',
          gridColumn: clicked
            ? `${defaultCol} / span ${spanActive}`
            : `span ${span}`,
          gridRow: clicked ? 'span 2' : 'span 1',
          opacity: visible || clicked ? 1 : opacity
        }}
        onClick={() => {
          if (visible) {
            clickHandler(clicked);
            this.setState(oldSt => ({
              clicked: visible ? !oldSt.clicked : null
            }));
          }
        }}
      >
        {children}
      </div>
    );
  }
}

Item.defaultProps = {
  clicked: false,
  opacity: 0.56,
  span: 3,
  clickHandler: d => d
};

export default Grid;
