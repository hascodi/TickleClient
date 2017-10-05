import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import VisibilitySensor from 'react-visibility-sensor';
import PropTypes from 'prop-types';

import cx from './Carousel.scss';

class Carousel extends Component {
  static propTypes = {
    children: PropTypes.node,
    height: PropTypes.number
  };

  // constructor(props) {
  //   super(props);
  // }

  componentDidMount() {
    // $(ReactDOM.findDOMNode(this)).carousel({ ride: 'pause', interval: false });
  }

  componentDidUpdate() {}

  shouldComponentUpdate(nextProps) {
    const { height, children } = this.props;
    if (
      height !== nextProps.height ||
      children.length !== nextProps.children.length
    )
      return true;
    return false;
  }

  render() {
    const { children, id } = this.props;
    // return (
    //   <div className={cx.wrapper}>
    //     {React.Children.map(children, (comp, i) => comp)}
    //   </div>
    // );
    return (
      <div className={cx.wrapper}>
        {React.Children.map(children, (comp, i) =>
          <VisibilitySensor
            offset={{
              // left: i === 0 ? 0 : 20,
              right:
                i === children.length - 1 || i === children.length - 2
                  ? -1
                  : 90,
              bottom: 0,
              top: 0
            }}
          >
            {({ isVisible }) =>
              <Cont col={i % 2 === 0 ? i + 1 : i} visible={isVisible}>
                {comp}
              </Cont>}
          </VisibilitySensor>
        )}
      </div>
    );
  }
}

Carousel.defaultProps = {
  data: [],
  id: 'carouselExampleIndicators',
  height: 100,
  children: () =>
    <img
      className="d-block"
      src="http://lorempixel.com/400/200/sports/1/Dummy-Text/"
      alt="First slide"
      width="700"
      height="700"
    />
};
class Cont extends Component {
  static propTypes = {
    children: PropTypes.node,
    clicked: PropTypes.bool,
    col: PropTypes.number,
    visible: PropTypes.bool
  };

  constructor(props) {
    super(props);
    const { clicked } = props;
    this.state = { clicked };
  }

  render() {
    const { children, col, visible } = this.props;
    const { clicked } = this.state;

    return (
      <div
        className={cx.cont}
        style={{
          height: '100%',
          gridColumn: clicked ? `${col} / span ${3}` : null,
          gridRowEnd: clicked ? 'span 2' : 'span 1',
          opacity: visible || clicked ? 1 : 0.56
        }}
        onClick={() => {
          this.setState(oldSt => ({
            clicked: visible ? !oldSt.clicked : null
          }));
        }}
      >
        {children}
      </div>
    );
  }
}
Cont.defaultProps = {
  clicked: false
};

export default Carousel;
