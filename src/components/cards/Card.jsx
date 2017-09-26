import React, { PropTypes } from 'react';
import * as d3 from 'd3';

import cx from './Card.scss';
import colorClasses from '../colorClasses';
import StarRating from './utils/StarRating';
// import Modal from '../utils/Modal';

const mediaTypes = ['game', 'hyperlink', 'photo', 'video'];

const mediaScale = d3
  .scaleOrdinal()
  .domain(mediaTypes)
  .range(['fa-gamepad', 'fa-link', 'fa-camera', 'fa-video-camera']);

console.log('mediaScale', mediaScale('hyperlink'));
const colorScale = d3
  .scaleLinear()
  .domain(d3.range(colorClasses.length))
  .range(colorClasses)
  .clamp(true);

const colorClass = () => colorScale(Math.random() * 30);

class CardFrontDetail extends React.Component {
  render() {
    const {
      caption,
      location,
      description,
      media,
      cardSets,
      linkedCards,
      place
    } = this.props;
    return (
      <div>
        <div className={`w3-margin w3-center ${cx.caption}`}>
          {caption}
        </div>
        <section className="w3-container">
          <table className="w3-table w3-striped w3-bordered">
            <tr className="">
              <td>Location:</td>
              <td>{`${place} (${Object.values(location).join(',')})`}</td>
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
                <div className="w3-row">
                  {media.map(m =>
                    <div key={m.src}>
                      <span className="w3-col" style={{ width: '20px' }}>
                        <i
                          className={`fa ${mediaScale(
                            m.type
                          )} fa-3 w3-margin-right`}
                          aria-hidden="true"
                        />
                      </span>
                      <span className="w3-rest">
                        {' '}<a href={m.src}> {m.name} </a>
                      </span>
                    </div>
                  )}
                </div>
              </td>
            </tr>
            <tr>
              <td>Card Sets</td>
              <td>
                {' '}{cardSets.map(c =>
                  <span key={c} className={`w3-tag ${colorClass()}`}>
                    {c}
                  </span>
                )}{' '}
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
  caption: React.PropTypes.string.isRequired,
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

const CardFrontPreview = ({
  key,
  title,
  Controls,
  tags,
  xpPoints,
  img,
  children
}) =>
  <div key={key} className={`w3-card-4 ${colorClass()}`}>
    {Controls}
    <section className="w3-margin w3-container">
      <h3>
        {title}
      </h3>
      <div className="w3-row">
        <div className="w3-col s4">
          <span className="w3-badge w3-round w3-large w3-green">
            Exp {xpPoints}
          </span>
        </div>
        <div className="w3-col s8 w3-right-align">
          {tags.map(t =>
            (<span
              key={t}
              className={`w3-tag w3-large ${colorClass()}`}
              style={{ float: 'right' }}
            >
              {t}
            </span>)
          )}
        </div>
      </div>
    </section>
    <div className="w3-container">
      <img
        className="w3-row-padding w3-col s12 w3-center"
        src={img}
        alt="Card cap"
      />
    </div>
    {children || null}
  </div>;

CardFrontPreview.propTypes = {
  // id: React.PropTypes.number,
  key: React.PropTypes.string.isRequired,
  title: React.PropTypes.string.isRequired,
  tags: React.PropTypes.array.isRequired,
  img: React.PropTypes.string.isRequired,
  xpPoints: React.PropTypes.number.isRequired,
  Controls: React.PropTypes.element,
  children: React.PropTypes.array
};

CardFrontPreview.defaultProps = {
  key: 'asa',
  title: 'TEST CARD TITLE',
  tags: ['cat1', 'tag2', 'tag3'],
  Controls: (
    <div className="w3-container">
      <span onClick={a => a} className="w3-closebtn">
        &times;
      </span>
      <span onClick={a => a} className="w3-closebtn">
        <i className="fa fa-retweet" aria-hidden="true" />
      </span>
    </div>
  ),
  img:
    'http://glintdemoz.com/timelylife/assets/attached_files/190_2016_06_11_12_24_44_testtest.jpg',
  children: []
};

// <span onClick={props.click2} className={`${cx.closeBtn} w3-btn`}>
//   <i className="fa fa-retweet fa-lg" aria-hidden="true" />
// </span>
const CardMini = props =>
  <div
    key={props.key}
    style={{ width: `${props.width}px`, height: `${props.height}px` }}
    className={`w3-card-4 ${props.color}`}
  >
    <span onClick={() => props.click1} className={`${cx.flipBtn} w3-btn`}>
      <i className="fa fa-search fa-lg" aria-hidden="true" />
    </span>
    <section className="w3-container">
      <h5>
        {props.title}
      </h5>
    </section>
    <div className="w3-container">
      <img
        style={{ maxHeight: '100px' }}
        className=" w3-col s12 w3-center"
        src={props.img}
        alt="Card cap"
      />
    </div>
  </div>;

CardMini.propTypes = {
  // id: React.PropTypes.number,
  key: React.PropTypes.string.isRequired,
  title: React.PropTypes.string.isRequired,
  img: React.PropTypes.string.isRequired,
  width: React.PropTypes.number.isRequired,
  height: React.PropTypes.number.isRequired,
  color: React.PropTypes.string.isRequired,
  click1: React.PropTypes.func,
  click2: React.PropTypes.func
};

CardMini.defaultProps = {
  key: 'asa',
  width: 180,
  height: 220,
  title: 'TEST CARD TITLE',
  img:
    'http://glintdemoz.com/timelylife/assets/attached_files/190_2016_06_11_12_24_44_testtest.jpg',
  color: colorClass()
};

const CardMini2 = ({ title, tags, img, width, height }) =>
  <li
    className={cx.cardMini2}
    style={{
      zIndex: 2,
      width: `${width}px`,
      height: `${height}px`
    }}
  >
    <img src={img} alt="image1" width={'100%'} height={`${height * 4 / 8}px`} />
    <h4>
      {title}
    </h4>
    <small>
      {tags.map((t, i) =>
        (<span
          key={t + i}
          className={`w3-tag ${colorClass()}`}
          style={{ float: 'right' }}
        >
          {t}
        </span>)
      )}
    </small>
  </li>;

CardMini2.PropTypes = CardMini.propTypes;
CardMini2.defaultProps = CardMini.defaultProps;

const CardBack = ({ key, Controls, friends, creator }) =>
  <div key={key} className={'w3-card-4 w3-sand'}>
    <div className="w3-card">
      {Controls}
      <div className="w3-container w3-section">
        <h2>Comments </h2>
        {friends.map(fr =>
          (<div key={fr.user} className="w3-row">
            <div className="w3-col s3">
              <h2 className={cx.stamp}>
                {fr.user}
              </h2>
            </div>
            <div className="w3-rest">
              <div>
                {' '}<StarRating />{' '}
              </div>
              <span style={{ fontStyle: 'italic' }} className={cx.textClamp}>
                {fr.comment}{' '}
              </span>
            </div>
          </div>)
        )}
      </div>
      <div className={'w3-container w3-section'}>
        <h2>Creator </h2>
        <div className={`w3-col ${cx.colSmallAvatar}`}>
          <div className="w3-col s4 w3-circle">
            <span className={cx.stamp}>
              {creator}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>;

CardBack.propTypes = {
  key: React.PropTypes.string.isRequired,
  creator: React.PropTypes.string.isRequired,
  Controls: React.PropTypes.shape,
  friends: React.PropTypes.array.isRequired
};

CardBack.defaultProps = {
  key: 'asa',
  Controls: (
    <div className="w3-container">
      <span onClick={a => a} className="w3-closebtn">
        &times;
      </span>
      <span onClick={a => a} className="w3-closebtn">
        <i className="fa fa-retweet" aria-hidden="true" />
      </span>
    </div>
  ),
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

const Controls = ({ flipHandler, closeHandler }) =>
  <div>
    <span onClick={flipHandler} className={`${cx.flipBtn} w3-btn`}>
      <i className="fa fa-retweet fa-lg" aria-hidden="true" />
    </span>
    <span onClick={closeHandler} className={`${cx.closeBtn} w3-btn`}>
      <i className="fa fa-times fa-lg" aria-hidden="true" />
    </span>
  </div>;

const CollectButton = ({ collected }) =>
  <div className="w3-padding">
    <button
      onClick={() => alert('MiniGame')}
      className={`w3-padding w3-btn w3-block w3-xxlarge w3-round ${colorClass()}`}
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
  constructor(props) {
    super(props);
    this.state = {
      frontView: true
    };
  }
  render() {
    const sideToggler = !this.state.frontView ? cx.flipAnim : null;
    // const style = { position: !this.state.frontView ? 'absolute' : null };
    const flipHandler = () =>
      this.setState({ frontView: !this.state.frontView });
    let ToggleCard;
    if (this.state.frontView) {
      ToggleCard = (
        <CardFront
          {...this.props}
          Controls={<Controls flipHandler={flipHandler} {...this.props} />}
        />
      );
    } else {
      ToggleCard = (
        <CardBack
          {...this.props}
          Controls={<Controls flipHandler={flipHandler} {...this.props} />}
        />
      );
    }

    return (
      <div className={`${cx.flipContainer} ${sideToggler}`}>
        <div className={`${cx.flipper} ${sideToggler}`}>
          <div>
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

CardFrontPreview.defaultProps = {
  title: 'Vrije Universiteit Brussel',
  key: 3,
  date: '28/04/2012 10:00',
  tags: ['Uni', 'education'],
  img:
    'https://drive.google.com/uc?export=view&id=1N9Ed6a_CDa8SEMZeLaxULF4FtkHBQf4Feg',
  caption: 'Main Entrance VUB',
  xpPoints: 50,
  // TODO: remove in future to component
  closeHandler: () => null,
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
  linkedCards: ['Sport_centre_vub', 'ULB_brussels']
};

export { Card, CardFrontPreview, CardMini, CardMini2 };
