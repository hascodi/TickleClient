import React, { PropTypes } from 'react';
import * as d3 from 'd3';
// import MapGL from 'react-map-gl';

import { CardMini2 } from './Card';
import CardStack from './CardStack2';
// import Notification from '../Notification';

// import Modal from '../utils/Modal';

import cx from './CardTimeLine.scss';

const timeFormatStr = '%d/%m/%Y %H:%M';
// const formatTime = d3.timeFormat(timeFormatStr);
// const formatLabelTime = d3.timeFormat('%d/%m/%Y');
const parseDate = d3.timeParse(timeFormatStr);

// function aggregateByTime(data, timeInterval) {
//   return d3.nest()
//     .key(d => formatTime(timeInterval(d.date)))
//     .entries(data)
//     .map((e) => {
//       e.date = parseDate(e.key);
//       return e;
//     });
// }

class CardStackWrapper extends React.Component {
  constructor(props) {
    super(props);

    const cards = props.cards
      .map((c, i) => {
        c.date = parseDate(c.date);
        c.key = i;
        c.id = i;
        return c;
      })
      .sort((a, b) => a.date - b.date);

    this.state = { cards, width: 800, height: 800 };
  }

  componentDidMount() {
    // const el = ReactDOM.findDOMNode(this);
    //
    const width = window.innerWidth/2; // el.getBoundingClientRect().width;
    const height = window.innerHeight; // el.getBoundingClientRect().height;
    this.setState({ width, height });
    // .stop();
    // for (let i = 0; i < 150; ++i) simulation.tick();
  }

  componentDidUpdate() {}

  render() {
    console.log('this.state', this.state);

    // let ModalContent;
    // if (this.state.selectedEvent !== null) {
    //   ModalContent =
    //     (<Card
    //       {...this.state.selectedEvent}
    //       collected
    //       closeHandler={() => this.setState({ selectedEvent: null })}
    //     />);
    // } else {
    //   ModalContent = null;
    // }

    return (
      <div
        ref={c => {
          this.comp = c;
        }}
        id="timeline"
        className={`w3-row ${cx.cont}`}
      >
        <div>
          <h1>Controls </h1>
        </div>
        <div>
          <CardStack
            firstCluster={this.state.cards}
            width={this.state.width}
            height={this.state.height}
            cardHeight={220}
            cardWidth={160}
            orientation="horizontal"
            element={<CardMini2 />}
            focussedFrame={this.state.focussedFrame}
            hoverHandler={focussedFrame => {
              this.setState({ focussedFrame });
            }}
          />
        </div>
      </div>
    );
  }
}

CardStackWrapper.defaultProps = {
  width: 1200,
  height: 1000,
  layerGap: 200
};

CardStackWrapper.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  layerGap: PropTypes.number,
  entryWidth: PropTypes.number,
  entryHeight: PropTypes.number,
  cards: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.number.isRequired
    }).isRequired
  ).isRequired
};

export default CardStackWrapper;
