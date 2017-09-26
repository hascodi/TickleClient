import React from 'react';
import styles from './ChallengesOverlay.scss';
// const window = require('global/window');
import DIVOverlay from './div.react';

 class ChalllengesOverlay extends React.Component {
  static propTypes() {
    return {
      // locations: React.PropTypes.array.isRequired,
      cardClickHandler: React.PropTypes.func.isRequired,
      cards: React.PropTypes.array.isRequired
    };
  }


  redraw(opt) {
    const width = 20;
    const height = 30;
    console.log('width', width);
    // console.log('self', self);
    // const scale = 0.5; // self.zoom;
    console.log('PROPS', this.props);
      const {cards} = this.props;
    return (
      cards.map((c) => {
        const pixel = opt.project([c.location.longitude, c.location.latitude]);
        console.log('pixel', pixel);
        return (
          <div
            key={c.key}
            className={`${styles.card} w3-button`}
            style={{
              transform: `translate(${pixel[0] - (width / 2)}px, ${pixel[1] - (height / 2)}px)`
            }}
            onTouchStart={() => this.cardClickHandler(c)}
            onClick={() => this.cardClickHandler(c)}
          >
            <i className="fa fa-fw fa-question fa-2x" />
          </div>
        );
      })

    );
  }


  render() {
    return <DIVOverlay {...this.props} redraw={this.redraw.bind(this)} />;
  }
    // width: React.PropTypes.number.isRequired,
    // height: React.PropTypes.number.isRequired,
    // longitude: React.PropTypes.number.isRequired,
    // latitude: React.PropTypes.number.isRequired,
    // zoom: React.PropTypes.number.isRequired,
    // isDragging: React.PropTypes.bool.isRequired
  // }

}

ChalllengesOverlay.defaultProps = {
      cardClickHandler: (d) => d,
      cards: []
};

// module.exports = React.createClass({
//
//   displayName: 'ExampleOverlay',
//
//   propTypes: {
//     locations: React.PropTypes.array.isRequired
//     // width: React.PropTypes.number.isRequired,
//     // height: React.PropTypes.number.isRequired,
//     // longitude: React.PropTypes.number.isRequired,
//     // latitude: React.PropTypes.number.isRequired,
//     // zoom: React.PropTypes.number.isRequired,
//     // isDragging: React.PropTypes.bool.isRequired
//   },
//
//   render: function render() {
//     return r(DIVOverlay, Object.assign({}, this.props, {
//       redraw: function redraw(opt) {
//         return r.g(this.props.locations.map((location) => {
//           const pixel = opt.project([location.longitude, location.latitude]);
//           return r.circle({
//             cx: pixel[0],
//             cy: pixel[1],
//             r: 10,
//             style: {
//               fill: 'rgba(231, 76, 60, 0.4)',
//               pointerEvents: 'all',
//               cursor: 'pointer'
//             },
//             onClick: function onClick() {
//               window.location.href = `https://en.wikipedia.org${location.wiki}`;
//             }
//           });
//         }));
//       }.bind(this)
//     }));
//   }
// });
export default ChalllengesOverlay;
