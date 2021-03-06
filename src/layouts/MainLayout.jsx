import React, { Component, PropTypes } from 'react';
// import DocumentMeta from 'react-document-meta';

// import { findRoute } from '../utils';

// import userPic from './user.png';
// import cx from './MainLayout.scss';

export default class MainLayout extends Component {
  static propTypes() {
    return {
      children: PropTypes.Array.isRequired
    };
  }

  constructor(props) {
    super(props);
    this.state = { isToggleOn: false };

    // This binding is necessary to make `this` work in the callback
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.setState(prevState => ({
      isToggleOn: !prevState.isToggleOn
    }));
  }

  render() {
    const { children } = this.props;

    return (
      <div>
        <div className="layout layout--main">
          <nav className="navbar navbar-expand-lg navbar-dark bg-1">
            <a className="navbar-brand" href="#">
              Tickle
            </a>
            <button
              className="navbar-toggler"
              type="button"
              data-toggle="collapse"
              data-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon" />
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav">
                <li className="nav-item active">
                  <a className="nav-link" href="#">
                    Home <span className="sr-only">(current)</span>
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#">
                    Features
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#">
                    Pricing
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link disabled" href="#">
                    Card authoring
                  </a>
                </li>
              </ul>
            </div>
          </nav>
          <div className="layout__content pt-1 pl-1 pr-1">
            {children}
          </div>
        </div>
      </div>
    );
  }
}
