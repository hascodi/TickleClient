import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
// import 'materialize-css';
// import './_carousel.scss';
// import './carousel';

// import 'materialize-css/js/carousel';
// import 'materialize-css/dist/css/materialize.css';

import PropTypes from 'prop-types';

import styles from './Carousel.scss';

class Carousel extends Component {
  static propTypes = {
    children: PropTypes.node,
    height: PropTypes.number
  };

  // constructor(props) {
  //   super(props);
  // }

  componentDidMount() {
    $(ReactDOM.findDOMNode(this)).carousel({ ride: 'pause', interval: false });
  }

  componentDidUpdate() {
    $(ReactDOM.findDOMNode(this)).carousel({ ride: 'pause', interval: false });
  }

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
      <div id={id} className="carousel slide">
        <ol className="carousel-indicators">
          {React.Children.map(children, (_, i) =>
            <li
              data-target={`#${id}`}
              data-slide-to={i}
              className={`${i === 0 ? 'active' : ''}`}
            />
          )}
        </ol>
        <div className="carousel-inner">
          {React.Children.map(children, (comp, i) =>
            <div className={`carousel-item ${i === 0 ? 'active' : ''}`}>
              <div className="row justify-content-center">
                {comp}
              </div>
            </div>
          )}
        </div>
        <a
          className="carousel-control-prev"
          href={`#${id}`}
          role="button"
          data-slide="prev"
        >
          <span aria-hidden="true">
            <i
              className="fa fa-chevron-left fa-5x"
              aria-hidden="true"
              style={{ color: 'black' }}
            />
          </span>
          <span className="sr-only">Previous</span>
        </a>
        <a
          className="carousel-control-next"
          href={`#${id}`}
          role="button"
          data-slide="next"
        >
          <span aria-hidden="true">
            <i
              className="fa fa-chevron-right fa-5x"
              aria-hidden="true"
              style={{ color: 'black' }}
            />
          </span>
          <span className="sr-only">Next</span>
        </a>
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
