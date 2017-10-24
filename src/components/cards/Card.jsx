import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';

import Modal from '../utils/Modal';
import { challengeTypes, mediaTypes } from '../../dummyData';
import 'w3-css';

import * as chromatic from 'd3-scale-chromatic';

import cx from './Card.scss';
import colorClasses from '../colorClasses';
// import StarRating from './utils/StarRating';
import exampleImg from './example_challenge.jpg';
// import Modal from '../utils/Modal';

const profileSrc = () => {
  const gender = Math.random() < 0.5 ? 'men' : 'women';
  const i = Math.round(Math.random() * 100);
  return `https://randomuser.me/api/portraits/thumb/${gender}/${i}.jpg`;
};
// console.log('colorClasses', colorClasses);

const mediaScale = d3
  .scaleOrdinal()
  .domain(mediaTypes)
  .range(['fa-gamepad', 'fa-link', 'fa-camera', 'fa-video-camera']);

// console.log('mediaScale', mediaScale('hyperlink'));
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

const defaultProps = {
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
  author: {
    name: 'Jan',
    comment: 'Yes, I wanna beat you all with super hard challenge!'
  },
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
      comment: 'here I succeeded my Master studies.',
      date: '22/04/2016'
    },
    {
      user: 'Jan',
      comment: 'Now, I finally earn money as PhD student at the VUB!',
      date: '22/04/2016'
    }
  ],
  rating: [
    {
      user: 'Nils',
      value: 4,
      date: '22/04/2016'
    }
  ],
  cardSets: ['scavenger_hunt_vub', 'Brussels_city_tour'],
  challenge: { type: 'quiz' }
};

const CardFrontDetail = ({
  description,
  media,
  cardSets,
  linkedCards,
  children
}) =>
  <div className={cx.cardDetail}>
    <div className={cx.textClamp}>
      <fieldset className={cx.field}>
        <legend>description</legend>
        <span onClick={() => alert(description)}>
          {description}
        </span>
      </fieldset>
    </div>
    <div>
      <div>
        <fieldset className={cx.field}>
          <legend>media:</legend>
          <div className="row no-gutters">
            {media.map(m =>
              <span className="row no-gutters" key={m.src}>
                <div className="col mr-1">
                  <i
                    className={`fa ${mediaScale(m.type)} fa-3`}
                    aria-hidden="true"
                  />
                </div>
                <div className="col mr-1">
                  <a href={m.src}>name</a>
                </div>
              </span>
            )}
          </div>
        </fieldset>
      </div>
    </div>
    <div>
      <fieldset className={cx.field}>
        <legend>Cardsets:</legend>
        <Tags data={cardSets} />
      </fieldset>
    </div>
    <div>
      <fieldset className={cx.field}>
        <legend>Linked Cards</legend>
        <Tags data={linkedCards} />
      </fieldset>
    </div>
    {children}
  </div>;

CardFrontDetail.propTypes = {
  place: PropTypes.string.isRequired,
  location: PropTypes.object,
  description: PropTypes.string.isRequired,
  media: PropTypes.array.isRequired,
  cardSets: PropTypes.array.isRequired,
  linkedCards: PropTypes.array.isRequired,
  children: PropTypes.node
};

CardFrontDetail.defaultProps = defaultProps;

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

CardFrontPreview.defaultProps = defaultProps;

const Tags = ({ data }) =>
  <small className={`text-truncate ${cx.tags}`}>
    {data.map(t =>
      <span key={t} className={`${cx.tag} ${colorClass()}`}>
        {t}
      </span>
    )}
  </small>;

const CardMini = ({
  title,
  tags,
  img,
  clickHandler,
  challenge,
  children,
  detailHandler,
  selected
  // id
}) =>
  <div
    className={`${cx.cardMini2} `}
    style={{
      zIndex: 2,
      background: colorScale(challenge.type)
    }}
  >
    <div className={cx.cardHeader}>
      {
        do {
          if (selected) {
            <h5 className="text-truncate">
              {title}
            </h5>;
          } else {
            <h4 className="text-truncate">
              {title}
            </h4>;
          }
        }
      }
      {
        do {
          if (selected) {
            <div className="btn-group">
              <button className="close mr-2">
                <i
                  className="fa fa-window-close fa-lg"
                  aria-hidden="true"
                  onClick={clickHandler}
                />
              </button>
              <button className="close">
                <i
                  className="fa fa-retweet fa-lg"
                  aria-hidden="true"
                  onClick={detailHandler}
                />
              </button>
            </div>;
          }
        }
      }
    </div>
    <div>
      <Tags data={tags} />
      <div className="mt-1 mb-1">
        <img
          style={{
            display: 'block',
            maxWidth: '100%',
            height: 'auto'
          }}
          src={img}
          alt="Card cap"
        />
      </div>
      {children}
    </div>
  </div>;

CardMini.propTypes = {
  title: PropTypes.string,
  tags: PropTypes.array,
  img: PropTypes.string,
  clickHandler: PropTypes.function,
  challenge: PropTypes.object,
  children: PropTypes.node
};

CardMini.defaultProps = CardFrontPreview.defaultProps;

const CardBack = ({ key, friends, challenge, author, detailHandler }) =>
  <div
    className={`container ${cx.cardMini2} `}
    style={{
      zIndex: 2,
      background: colorScale(challenge.type)
    }}
  >
    <div>
      <div className={cx.cardHeader}>
        <h5>Comments</h5>
        <button className="close">
          <i
            className="col-1 fa fa-retweet fa-lg"
            aria-hidden="true"
            onClick={detailHandler}
          />
        </button>
      </div>
      <div>
        {friends.map(({ comment, user, date }) =>
          <div className="media mt-3">
            <img
              className={`d-flex mr-3 ${cx.avatar}`}
              width={64}
              height={64}
              src={profileSrc()}
              alt="alt"
            />
            <div className="media-body">
              <div className={cx.textClamp}>
                {comment}
              </div>
              <div>
                <small className="font-italic">
                  - {user}, {date}
                </small>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
    <div>
      <h3>Author</h3>
      <div className="media mt-3">
        <img
          className={`d-flex mr-3 ${cx.avatar}`}
          width={64}
          height={64}
          src={profileSrc()}
          alt="alt"
        />
        <div className="media-body">
          <div className={cx.textClamp}>
            {author.comment}
          </div>
          <div>
            <small className="font-italic">
              - {author.name}
            </small>
          </div>
        </div>
      </div>
    </div>
  </div>;

CardBack.propTypes = {
  key: React.PropTypes.string.isRequired,
  author: React.PropTypes.string.isRequired,
  friends: React.PropTypes.array.isRequired
};

CardBack.defaultProps = {
  key: 'asa',
  friends: [
    {
      user: 'Nils',
      img:
        'https://placeholdit.imgix.net/~text?txtsize=6&txt=50%C3%9750&w=50&h=50',
      comment: 'I did not know that he was such a famous composer',
      date: '22/04/2016'
    },
    {
      user: 'Babba',
      comment: 'What a nice park, strange, that they put a mask on his face!',
      date: '22/04/2016'
    }
  ],
  author: { name: 'jan', comment: 'welcome to my super hard challenge!' }
};

const CollectButton = ({ collected, dataTarget, toggleCardChallenge }) =>
  <div className="p-1 pt-3">
    <button
      className={`btn btn-secondary btn-lg btn-block}`}
      style={{ width: '100%' }}
      data-toggle="modal"
      data-target={dataTarget}
      onClick={() => toggleCardChallenge({ cardChallengeOpen: true })}
    >
      <span>
        {`${collected ? 'RePlay' : 'Collect'}!`}
      </span>
      {collected || <i className="fa fa-lock" aria-hidden="true" />}
    </button>
  </div>;

CollectButton.propTypes = {
  dataTarget: PropTypes.string,
  collected: PropTypes.bool,
  toggleCardChallenge: PropTypes.func
};

CollectButton.defaultProps = {
  dataTarget: '#exampleModal',
  collected: false,
  toggleCardChallenge: d => d
};

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

    const ToggleCard = do {
      if (this.state.frontView) {
        <CardMini
          {...this.props}
          detailHandler={() =>
            this.setState({ frontView: !this.state.frontView })}
        >
          <CardFrontDetail {...this.props}>
            <CollectButton {...this.props} />
          </CardFrontDetail>
        </CardMini>;
      } else {
        <CardBack
          {...this.props}
          detailHandler={() =>
            this.setState({ frontView: !this.state.frontView })}
        />;
      }
    };

    return (
      <div className={`${cx.flipContainer} ${sideToggler}`}>
        <div className={`${cx.flipper} ${sideToggler}`}>
          {ToggleCard}
        </div>
      </div>
    );
  }
}

Card.propTypes = {
  closeHandler: React.PropTypes.func
};

const CardCont = ({ ...props }) =>
  props.selected ? <Card {...props} /> : <CardMini {...props} />;

CardCont.defaultProps = {
  selected: true
};

CardCont.propTypes = { selected: PropTypes.bool };

export { Card, CardCont, CardFrontPreview, CardMini };
