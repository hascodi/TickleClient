import React, { PropTypes, Component } from 'react';
import * as d3 from 'd3';

import 'w3-css';

import * as chromatic from 'd3-scale-chromatic';

import cx from './Card.scss';
import colorClasses from '../colorClasses';
import StarRating from './utils/StarRating';
import exampleImg from './example_challenge.jpg';
// import Modal from '../utils/Modal';

const mediaTypes = ['game', 'hyperlink', 'photo', 'video'];

console.log('colorClasses', colorClasses);

const mediaScale = d3
  .scaleOrdinal()
  .domain(mediaTypes)
  .range(['fa-gamepad', 'fa-link', 'fa-camera', 'fa-video-camera']);

console.log('mediaScale', mediaScale('hyperlink'));
const challengeTypes = ['quiz'];
const colorScale = d3
  .scaleOrdinal()
  .domain(challengeTypes)
  .range(chromatic.schemePastel1);

const colorScaleRandom = d3
  .scaleLinear()
  .domain(d3.range(colorClasses.length))
  .range(colorClasses)
  .clamp(true);

const colorClass = () => colorScaleRandom(Math.random() * 30);

// const maxHeight = (h) =>

class CardFrontDetail extends React.Component {
  render() {
    const {
      location,
      description,
      media,
      cardSets,
      linkedCards,
      place
    } = this.props;
    return (
      <div>
        <section className="container">
          <table className="table table-sm table-responsive">
            <tr className="">
              <td>Location:</td>
              <td>
                {place}
              </td>
            </tr>
            <tr>
              <td>Description:</td>
              <td>
                <div className={cx.textClamp}>
                  {description}
                </div>
              </td>
            </tr>
            <tr className="">
              <td>Media</td>
              <td>
                <div className="row">
                  {media.map(m =>
                    <div key={m.src}>
                      <span className="col-1" style={{ width: '20px' }}>
                        <i
                          className={`fa ${mediaScale(m.type)} fa-3`}
                          aria-hidden="true"
                        />
                      </span>
                      <span>
                        <a href={m.src}>
                          {m.name}
                        </a>
                      </span>
                    </div>
                  )}
                </div>
              </td>
            </tr>
            <tr>
              <td>Card Sets</td>
              <td>
                {cardSets.map(c =>
                  <span key={c} className={`w3-tag ${colorClass()}`}>
                    {c}
                  </span>
                )}
              </td>
            </tr>
            <tr>
              <td>linked Cards</td>
              <td>
                {' '}{linkedCards.map(c =>
                  <span key={c} className={`w3-tag ${colorClass()}`}>
                    {c}
                  </span>
                )}{' '}
              </td>
            </tr>
          </table>
        </section>
      </div>
    );
  }
}

CardFrontDetail.propTypes = {
  place: React.PropTypes.string.isRequired,
  location: React.PropTypes.object,
  description: React.PropTypes.string.isRequired,
  media: React.PropTypes.array.isRequired,
  cardSets: React.PropTypes.array.isRequired,
  linkedCards: React.PropTypes.array.isRequired
};

CardFrontDetail.defaultProps = {
  key: 'asa',
  description: 'What so special about the location, describe it',
  location: { latitude: 50.828797, longitude: 4.352191 },
  place: 'Park next to my Home',
  creator: 'Jan',
  media: [
    { type: 'photo', src: 'todo' },
    {
      type: 'hyperlink',
      src: 'https://en.wikipedia.org/wiki/Arthur_De_Greef_(composer)'
    },
    { type: 'game', src: 'todo' }
  ],
  cardSets: ['Brussels VIP', 'Music challenge (Cards can be specific sets)']
};

const MediaGrid = ({ data }) =>
  <div className="row">
    {data.map((m, i) =>
      <div className="col-3">
        <i className={`fa ${mediaScale(m.type)} fa-2x`} aria-hidden="true" />
      </div>
    )}
  </div>;

const CardFrontPreview = ({
  key,
  title,
  tags,
  xpPoints,
  img,
  media,
  height,
  children
}) =>
  <div key={key}>
    <section className="m-1 container">
      <h3>
        {title}
      </h3>
      <div className="row">
        <div className="col-4">
          <span className="w3-badge w3-round w3-large w3-green">
            Exp {xpPoints}
          </span>
        </div>
        <div className="col-8">
          {tags.map(t =>
            <span
              key={t}
              className={`w3-tag w3-large ${colorClass()}`}
              style={{ float: 'right' }}
            >
              {t}
            </span>
          )}
        </div>
      </div>
      <div className="mt-3 mb-1">
        <div className="col-12">
          <img
            className="mx-auto d-block img-fluid rounded mb-2"
            style={{ width: '100%' }}
            src={img}
            alt="Card cap"
          />
        </div>
      </div>
      <MediaGrid data={media} />
      {children || null}
    </section>
  </div>;

CardFrontPreview.defaultProps = {
  title: 'Vrije Universiteit Brussel',
  key: 3,
  date: '28/04/2012 10:00',
  tags: ['Uni', 'education'],
  img: exampleImg,
  xpPoints: 50,
  // TODO: remove in future to component
  description: 'description',
  location: { latitude: 50.821705, longitude: 4.395165 },
  place: 'Pleinlaan 2 - 1050 BRUSSEL',
  creator: 'Jan',
  media: [
    {
      type: 'hyperlink',
      name: 'Website',
      src: 'http://we.vub.ac.be'
    },
    {
      type: 'video',
      name: "Some of the VUB's international students",
      src: 'https://www.youtube.com/watch?v=YFCzlOqQW7M'
    }
  ],
  friends: [
    {
      user: 'Chauncey',
      comment: 'here I succeeded my Master studies.'
    },
    {
      user: 'Jan',
      comment: 'Now, I finally earn money as PhD student at the VUB!'
    }
  ],
  rating: [
    {
      user: 'Nils',
      value: 4
    }
  ],
  cardSets: ['scavenger_hunt_vub', 'Brussels_city_tour'],
  challenge: { type: 'quiz' }
};

const CardMini = ({ title, tags, img, clickHandler, challenge }) =>
  <div
    className={`${cx.cardMini2} `}
    style={{
      zIndex: 2,
      background: colorScale(challenge.type)
    }}
    onClick={() => clickHandler({ preview: false })}
  >
    <h4 className="text-truncate">
      {title}
    </h4>
    <div>
      <small className={`text-truncate ${cx.tags}`}>
        {tags.map(t =>
          <span key={t} className={`${cx.tag} ${colorClass()}`}>
            {t}
          </span>
        )}
      </small>
      {/* TODO */}
      <div className="mt-1 mb-1" style={{ overflow: 'hidden' }}>
        <img
          style={{ width: '100%', height: 'auto' }}
          src={img}
          alt="Card cap"
        />
      </div>
    </div>
  </div>;

CardMini.propTypes = {
  title: PropTypes.string,
  tags: PropTypes.array,
  img: PropTypes.string,
  clickHandler: PropTypes.function,
  challenge: PropTypes.object
};

CardMini.defaultProps = CardFrontPreview.defaultProps;

const CardBack = ({ key, friends, creator }) =>
  <div>
    <div className="container w3-section">
      <h2>Comments </h2>
      {friends.map(fr =>
        <div key={fr.user} className="row">
          <div className="col-3">
            <h2 className={cx.stamp}>
              {fr.user}
            </h2>
          </div>
          <div className="col-9">
            <div>
              <StarRating />
            </div>
            <span style={{ fontStyle: 'italic' }} className={cx.textClamp}>
              {fr.comment}
            </span>
          </div>
        </div>
      )}
    </div>
    <div className={'container w3-section'}>
      <h2>Creator </h2>
      <div className={`col ${cx.colSmallAvatar}`}>
        <div className="col-4 ">
          <span className={cx.stamp}>
            {creator}
          </span>
        </div>
      </div>
    </div>
  </div>;

CardBack.propTypes = {
  key: React.PropTypes.string.isRequired,
  creator: React.PropTypes.string.isRequired,
  friends: React.PropTypes.array.isRequired
};

CardBack.defaultProps = {
  key: 'asa',
  friends: [
    {
      user: 'Nils',
      img:
        'https://placeholdit.imgix.net/~text?txtsize=6&txt=50%C3%9750&w=50&h=50',
      text: 'I did not know that he was such a famous composer'
    },
    {
      user: 'Babba',
      text: 'What a nice park, strange, that they put a mask on his face!'
    }
  ]
};

const CollectButton = ({ collected }) =>
  <div className="p-1">
    <button
      onClick={() => alert('MiniGame')}
      className={`btn btn-secondary btn-lg btn-block}`}
    >
      <span style={{ marginLeft: '10px' }}>
        {' '}{`${collected ? 'RePlay' : 'Collect'}!`}
      </span>
      {collected || <i className="fa fa-lock" aria-hidden="true" />}
    </button>
  </div>;

const CardFront = props =>
  <CardFrontPreview {...props}>
    <CardFrontDetail {...props} />
    <CollectButton {...props} />
  </CardFrontPreview>;

class Card extends React.Component {
  static propTypes = {
    onMinify: PropTypes.function
  };
  constructor(props) {
    super(props);
    this.state = {
      frontView: true
    };
  }

  render() {
    const { frontView } = this.state;
    const sideToggler = frontView ? cx.flipAnim : null;
    // const style = { position: !this.state.frontView ? 'absolute' : null };

    let ToggleCard;
    if (this.state.frontView) {
      ToggleCard = <CardFront {...this.props} />;
    } else {
      ToggleCard = <CardBack {...this.props} />;
    }

    return (
      <div className={`${cx.flipContainer} ${sideToggler}`}>
        <div className={`${cx.flipper} ${sideToggler}`}>
          <div className={`w3-card w3-blue ${cx.card}`}>
            <div>
              <span
                onClick={() =>
                  this.setState({ frontView: !this.state.frontView })}
                className="btn "
              >
                <i className="fa fa-retweet fa-lg" aria-hidden="true" />
              </span>
            </div>
            {ToggleCard}
          </div>
        </div>
      </div>
    );
  }
}

Card.propTypes = {
  closeHandler: React.PropTypes.func
};

class CardCont extends Component {
  static propTypes = {
    preview: PropTypes.bool
  };

  constructor(props) {
    super(props);
    this.detailHandler = this.detailHandler.bind(this);
    this.state = { ...this.props };
  }

  detailHandler(preview) {
    // this.setState({ preview: false });
  }

  render() {
    return this.state.preview
      ? <CardMini {...this.props} clickHandler={this.detailHandler} />
      : <Card {...this.props} detailHandler={this.detailHandler} />;
  }
}

CardCont.defaultProps = {
  preview: true
};

export { Card, CardCont, CardFrontPreview, CardMini };
