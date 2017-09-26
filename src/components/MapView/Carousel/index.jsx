import React, { Component } from 'react';

// import 'materialize-css';
// import './_carousel.scss';
// import './carousel';

// import 'materialize-css/js/carousel';
// import 'materialize-css/dist/css/materialize.css';

import PropTypes from 'prop-types';

import styles from './Carousel.scss';

console.log('Styles', styles);

class Carousel extends Component {
  static propTypes = {
    data: PropTypes.array,
    children: PropTypes.node
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {}

  render() {
    return (
      <div
        id="carouselExampleIndicators"
        className="carousel slide"
        data-ride="carousel"
      >
        <ol className="carousel-indicators">
          <li
            data-target="#carouselExampleIndicators"
            data-slide-to="0"
            className="active"
          />
          <li data-target="#carouselExampleIndicators" data-slide-to="1" />
          <li data-target="#carouselExampleIndicators" data-slide-to="2" />
        </ol>
        <div className="carousel-inner">
          <div className="carousel-item active">
            <img
              className="d-block w-100"
              src="http://lorempixel.com/400/200/sports/1/Dummy-Text/"
              alt="First slide"
              width="700"
              height="700"
            />
          </div>
          <div className="carousel-item">
            <img
              className="d-block w-100"
              src="http://lorempixel.com/400/200/sports/1/Dummy-Text/"
              alt="Second slide"
              width="700"
              height="700"
            />
          </div>
          <div className="carousel-item">
            <img
              className="d-block w-100"
              src="http://lorempixel.com/400/200/sports/1/Dummy-Text/"
              alt="Third slide"
              width="700"
              height="700"
            />
          </div>
        </div>
        <a
          className="carousel-control-prev"
          href="#carouselExampleIndicators"
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
          href="#carouselExampleIndicators"
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
  children: d =>
    (<div>
      {d}
    </div>)
};

export default Carousel;
