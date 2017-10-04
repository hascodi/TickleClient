import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import 'slick-carousel';
// import $ from 'jquery';
// import 'materialize-css';
// import './_carousel.scss';
// import './carousel';

// import 'materialize-css/js/carousel';
// import 'materialize-css/dist/css/materialize.css';

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
    return (
      <div className={cx.wrapper}>
        {React.Children.map(children, (comp, i) =>
          <span
            style={{
              height: '100%',
              gridColumnEnd: i === 3 ? 'span 2' : null,
              gridRow: i === 3 ? '1' : null
            }}
          >
            {comp}
          </span>
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

export default Carousel;
