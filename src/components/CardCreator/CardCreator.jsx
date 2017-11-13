import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import { CardMini, CardCont } from '../cards/Card';
import cxx from './CardCreator.scss';

import { ScrollView, ScrollElement } from '../utils/ScrollView';

class CardCreator extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    screenResize: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    const { screenResize, cards } = this.props;
    // TODO: fix later;
    const [width, height] = [window.innerWidth - 4, window.innerHeight];
    screenResize({ width, height });
    this.state = { selected: cards[0] };
  }

  componentDidMount() {
    // const el = ReactDOM.findDOMNode(this);
    // scrollTo(5);
    this._scroller.scrollTo(5);
  }
  componentDidUpdate() {
    scrollTo(5);
  }

  scrollTo = name => {
    this._scroller.scrollTo(name);
  };

  render() {
    const { cards, width, height } = this.props;
    const { selected } = this.state;
    console.log('thisprops', this.props);
    return (
      <div
        className={`${cxx.base}`}
        style={{ width: `${width}px`, height: `${height}px` }}
      >
        <div className="row" style={{ height: '100%', width: '100%' }}>
          <div className="col-3" style={{ height: '100%', width: '100%' }}>
            <div className={cxx.grid}>
              <ScrollView ref={scroller => (this._scroller = scroller)}>
                <span>
                  {cards.map((d, i) =>
                    <div onClick={() => this.setState({ selected: d })}>
                      <ScrollElement name={i}>
                        <CardMini {...d} {...this.props} />
                      </ScrollElement>
                    </div>
                  )}
                </span>
              </ScrollView>
            </div>
          </div>
          <div className="col-9" style={{ height: '100%', width: '100%' }}>
            <div style={{ height: '20%' }} />
            <div className={cxx.main} style={{ height: '80%' }}>
              <CardCont {...selected} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CardCreator;
