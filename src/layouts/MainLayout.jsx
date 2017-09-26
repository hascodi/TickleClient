import React, { Component, PropTypes } from 'react';
import DocumentMeta from 'react-document-meta';

// import { findRoute } from '../utils';
import { routes, LinkHelper } from '../Routes';


import userPic from './user.png';
import './MainLayout.scss';


export default class MainLayout extends Component {

  static propTypes() {
    return {
      location: PropTypes.object,
      children: PropTypes.Array
    };
  }

  constructor(props) {
    super(props);
    this.state = { isToggleOn: false };

    // This binding is necessary to make `this` work in the callback
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    console.log('state', this.state);
    this.setState(prevState => ({
      isToggleOn: !prevState.isToggleOn
    }));
  }

  render() {
    // $('.navbar-nav').on('click', () => {
    //   $('.navbar-collapse').collapse('hide');
    // });
    const { children, location, label} = this.props;
    console.log('MainLayout props', this.props);
    // const cfg = findRoute(location.pathname);
    // const route = cfg || routes.homepage;
    // const route = routes.App;
    const navLinkProps = {
      className: 'w3-bar-item w3-button',
      activeClassName: 'layout__nav-link--selected'
      // 'data-toggle': 'collapse'
      // 'data-target': '.navbar-collapse.show'
    };

    let toggleStyle;
    if (this.state.isToggleOn) {
      toggleStyle = 'w3-show';
    } else toggleStyle = 'w3-hide-large w3-hide-medium w3-hide';

    console.log('toggleStyle', toggleStyle);

    return (
      <div>
        <div className="layout layout--main">
          <DocumentMeta title={location} />
          <div className="w3-bar w3-indigo w3-xlarge">
            <a className="w3-bar-item w3-button w3-left" onClick={this.handleClick}>
              <img
                className="w3-hide-small" type="button"
                style={{ height: '40px' }}
                src={userPic}
                alt={location.pathname}
              />
            </a>
            <a
              className="w3-cell w3-cell-middle w3-left"
              style={{ paddingTop: '8px' }}
              onClick={this.handleClick}
            >
              {location.pathname}
            </a>
          </div>
          <div className={`w3-bar-block w3-indigo ${toggleStyle}`}>
            <LinkHelper to="Journal" {...navLinkProps} onClick={this.handleClick} />
            <LinkHelper to="Map" {...navLinkProps} onClick={this.handleClick} />
            <LinkHelper to="Challenge" {...navLinkProps} onClick={this.handleClick} />
          </div>
          <div className="layout__content" style={{ overflow: 'hidden' }}>
            {children}
          </div>
        </div>
      </div>
    );
  }
}
