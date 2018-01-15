import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import MapGL from 'react-map-gl';
import Truncate from 'react-truncate';

import 'w3-css';

import Grid from '../utils/Grid';
import { challengeTypes, mediaTypes } from '../../dummyData';
// TODO: replace

import * as chromatic from 'd3-scale-chromatic';

import cx from './Card.scss';
import colorClasses from '../colorClasses';
// import StarRating from './utils/StarRating';
// import exampleImg from './example_challenge.jpg';
import { Wrapper } from '../utils';

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
  title: 'The peculiar story of Arthur De Greef',
  challenge: { type: 'gap text' },
  date: '28/04/2012 10:00',
  tags: ['Art', 'Culture', 'Music'],
  img:
    'https://drive.google.com/uc?export=view&id=1N9Ed6a_CDa8SEMZeLaxULF4FtkHBQf4Feg',
  xpPoints: 100,
  // TODO: remove in future to component
  description:
    'This is an empty description. That means the card has been initialized without data',
  loc: { latitude: 50.828797, longitude: 4.352191 },
  place: 'Park next to my Home',
  creator: 'Jan',
  media: [
    {
      type: 'photo',
      name: 'franz-liszt---the-first-rock-star',
      src: ''
    },
    {
      type: 'hyperlink',
      name: 'franz-liszt---the-first-rock-star',
      src: ''
    },
    {
      type: 'game',
      name: 'franz-liszt---the-first-rock-star',
      src: ''
    }
  ],
  comments: [
    {
      user: 'Nils',
      comment: 'I did not know that he was such a famous composer'
    },
    {
      user: 'Babba',
      comment: 'What a nice park, strange, that they put a mask on his face!'
    }
  ],
  cardSets: ['european_composers'],
  linkedCards: ['Frank Liszt', 'Music school Arthur de Greef']
};

const Media = ({ data }) =>
  <Grid col={2} row={data.length / 2}>
    {data.map(m =>
      <div key={m.src}>
        <div className="mr-1 row">
          <i
            className={`fa ${mediaScale(m.type)} fa-2x col-1`}
            aria-hidden="true"
          />
          <div className="ml-1 col">
            <a href={m.src}>name</a>
          </div>
        </div>
      </div>
    )}
  </Grid>;

Media.propTypes = {
  data: PropTypes.array.isRequired,
  extended: PropTypes.bool
};

Media.defaultProps = { data: defaultProps.media, extended: false };

const CardFront = ({ tags, img, description, media, children }) =>
  <div className={cx.cardDetail} style={{ height: '100%', width: '100%' }}>
    <Tags data={tags} />
    <div className="mt-1 mb-1">
      <img
        style={{
          maxWidth: '100%',
          height: '20%'
        }}
        src={img}
        alt="Card cap"
      />
    </div>
    <div className={cx.textClamp} style={{ height: '20%' }}>
      <fieldset className={cx.field}>
        <legend>description</legend>
        <div>
          {description}
        </div>
      </fieldset>
    </div>
    <div style={{ height: '10%' }}>
      <fieldset className={cx.field}>
        <legend>Media:</legend>
        <Media data={media} />
      </fieldset>
    </div>
    <div style={{ height: '17%', display: 'flex' }}>
      {children}
    </div>
  </div>;

CardFront.propTypes = {
  description: PropTypes.string.isRequired,
  img: PropTypes.string.isRequired,
  children: PropTypes.array
};

CardFront.defaultProps = defaultProps;

const Tags = ({ data }) =>
  <div
    style={{
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center'
    }}
    className={`${cx.textTrunc} ${cx.tags}`}
  >
    {data.map(t =>
      <small key={t} className={`${cx.tag} ${colorClass()}`}>
        {t}
      </small>
    )}
  </div>;

const SmallCategories = ({ data }) =>
  <div className={`${cx.textTrunc} ${cx.tags}`}>
    {data.map(t =>
      <small key={t} className={`${cx.tag} ${colorClass()}`}>
        {t}
      </small>
    )}
  </div>;

const PreviewCard = ({ title, tags, img, challenge, style, onClick }) =>
  <div
    className={cx.cardMini2}
    style={{
      background: colorScale(challenge.type),
      ...style
    }}
    onClick={onClick}
  >
    <div className={cx.cardHeader}>
      <h5 className="text-truncate">
        {title}
      </h5>
    </div>
    <div>
      <SmallCategories data={tags} />
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
    </div>
  </div>;

PreviewCard.propTypes = {
  title: PropTypes.string.isRequired,
  tags: PropTypes.array.isRequired,
  img: PropTypes.string,
  challenge: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
  style: PropTypes.object
};

PreviewCard.defaultProps = { ...defaultProps, style: {} };

const CardFrame = ({
  title,
  tags,
  img,
  onClose,
  challenge,
  children,
  flipHandler,
  style
  // id
}) =>
  <div
    className={`${cx.cardMini2} `}
    style={{
      background: colorScale(challenge.type),
      overflow: 'hidden',
      ...style
    }}
  >
    <div className={cx.cardHeader}>
      <h3 className="text-truncate">
        {title}
      </h3>
      <div className="btn-group">
        <button className="close mr-2" onClick={onClose}>
          <i className="fa fa-window-close fa-lg" aria-hidden="true" />
        </button>
        <button className="close" onClick={flipHandler}>
          <i className="fa fa-retweet fa-lg" aria-hidden="true" />
        </button>
      </div>
    </div>
    <div style={{ width: '100%', height: '100%' }}>
      {children}
    </div>
  </div>;

CardFrame.propTypes = {
  title: PropTypes.string,
  tags: PropTypes.array,
  img: PropTypes.string,
  flipHandler: PropTypes.func,
  challenge: PropTypes.object,
  children: PropTypes.node
};

CardFrame.defaultProps = defaultProps;

const Comments = ({ data, extended }) =>
  <div style={{ display: 'flex', justifyContent: 'center' }}>
    {data.map(({ comment, user, date }) =>
      <div>
        <img
          className={`${cx.avatar}`}
          width={'100%'}
          height={'100%'}
          src={profileSrc()}
          alt="alt"
        />
        {extended &&
          <div className="media-body">
            <div className={cx.textClamp}>
              <small>
                {comment}
              </small>
            </div>
            <div>
              <small className="font-italic">
                - {user}, {date}
              </small>
            </div>
          </div>}
      </div>
    )}
  </div>;

Comments.PropTypes = {
  data: PropTypes.array.isRequired,
  extended: PropTypes.bool.isRequired
};

Comments.defaultProps = {
  data: [{ user: 'Jan', date: new Date(), comment: 'Yes, cool shit' }],
  extended: false
};

const Author = ({ profile, extended }) =>
  <div
    className="media"
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}
  >
    <img
      className={`${cx.avatar}`}
      width={82}
      height={82}
      src={profileSrc()}
      alt="alt"
    />
  </div>;

const Profile = ({ data }) =>
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
        {data.comment}
      </div>
      <div>
        <small className="font-italic">
          - {data.name}
        </small>
      </div>
    </div>
  </div>;

Profile.PropTypes = {
  data: PropTypes.object.isRequired
};

// TODO; rempve
Profile.defaultProps = { name: 'jan', comment: 'yeah' };

class CardBack extends Component {
  static propTypes = {
    key: PropTypes.string.isRequired,
    comments: PropTypes.array.isRequired,
    challenge: PropTypes.object.isRequired,
    author: PropTypes.object.isRequired,
    flipHandler: PropTypes.func.isRequired,
    cardSets: PropTypes.object.isRequired,
    linkedCards: PropTypes.object.isRequireds,
    loc: PropTypes.shape({
      latitude: PropTypes.number,
      longitude: PropTypes.number
    }),
    media: PropTypes.array.isRequired
  };

  constructor(props) {
    super(props);

    this.state = { extended: null };
  }

  render() {
    const {
      challenge,
      comments,
      media,
      cardSets,
      linkedCards,
      loc,
      author
    } = this.props;
    const { extended } = this.state;
    const selectField = field => () =>
      this.setState(prevstate => ({
        extended: prevstate.extended !== field ? field : null
      }));

    const setStyle = field => {
      if (field === extended)
        return {
          height: '100%',
          gridColumn: `span ${2}`,
          gridRow: `span ${3}`
        };
      return {
        display: extended !== null ? 'none' : null
      };
    };

    return (
      <div
        className={`container ${cx.cardMini2} `}
        style={{
          background: colorScale(challenge.type),
          height: '100%',
          zIndex: -10
        }}
      >
        <Grid cols={2} rows={3} gap={1}>
          <fieldset
            className={cx.field}
            style={{ ...setStyle('author') }}
            onClick={selectField('author')}
          >
            <legend>Author:</legend>
            <Author profile={author} />
          </fieldset>
          <fieldset
            className={cx.field}
            style={setStyle('map')}
            onClick={selectField('map')}
          >
            <legend>Map:</legend>
            <Wrapper>
              {(width, height) =>
                <MapGL
                  width={width}
                  height={height}
                  latitude={loc.latitude}
                  longitude={loc.longitude}
                  zoom={8}
                />}
            </Wrapper>
          </fieldset>
          <fieldset
            className={cx.field}
            style={setStyle('cardSets')}
            onClick={selectField('cardSets')}
          >
            <legend>Cardsets:</legend>
            <Tags data={cardSets} />
          </fieldset>
          <fieldset
            className={cx.field}
            style={setStyle('linkedCards')}
            onClick={selectField('linkedCards')}
          >
            <legend>Linked Cards</legend>
            <Tags data={linkedCards} />
          </fieldset>
          <fieldset
            colSpan={2}
            className={cx.field}
            style={{ ...setStyle('comments') }}
            onClick={selectField('comments')}
          >
            <legend>Comments:</legend>
            <Comments data={comments} />
          </fieldset>
        </Grid>
      </div>
    );
  }
}

CardBack.defaultProps = {
  challenge: { type: '0' },
  comments: Comments.defaultProps.data,
  media: Media.defaultProps.data,
  cardSets: ['testseries', 'pirateSet'],
  linkedCards: ['Captain hook', 'yeah'],
  loc: { latitude: 0, longitude: 0 },
  author: Profile.defaultProps.data
};

// CardBack.defaultProps = {
//   key: 'asa',
//   comments: [
//     {
//       user: 'Nils',
//       img:
//         'https://placeholdit.imgix.net/~text?txtsize=6&txt=50%C3%9750&w=50&h=50',
//       comment: 'I did not know that he was such a famous composer',
//       date: '22/04/2016'
//     },
//     {
//       user: 'Babba',
//       comment: 'What a nice park, strange, that they put a mask on his face!',
//       date: '22/04/2016'
//     }
//   ],
//   author: { name: 'jan', comment: 'welcome to my super hard challenge!' }
// };

const CollectButton = ({ collected, dataTarget, onClick, expPoints }) =>
  <div className="p-1 pt-3" style={{ alignSelf: 'end', width: '100%' }}>
    <button
      className={`btn btn-secondary btn-lg btn-block}`}
      style={{ width: '100%' }}
      data-toggle="modal"
      data-target={dataTarget}
      onClick={onClick}
    >
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <span>
          {'Collect'}
        </span>
        <div
          style={{
            marginLeft: '4px',
            paddingLeft: '4px',
            paddingRight: '4px',
            border: '1px black solid',
            borderRadius: '5px'
          }}
        >
          {`${expPoints}xp`}
        </div>
      </div>
    </button>
  </div>;

CollectButton.propTypes = {
  dataTarget: PropTypes.string,
  collected: PropTypes.bool,
  onClick: PropTypes.func,
  expPoints: PropTypes.number
};

CollectButton.defaultProps = {
  dataTarget: '#exampleModal',
  collected: false,
  toggleCardChallenge: d => d,
  expPoints: 60
};

class Card extends React.Component {
  static propTypes = {
    onClose: PropTypes.oneOf([null, PropTypes.func]),
    collectHandler: PropTypes.oneOf([null, PropTypes.func]),
    style: PropTypes.object
  };
  static defaultProps = {
    onClose: d => d,
    collectHandler: null,
    style: {}
  };

  constructor(props) {
    super(props);
    this.state = {
      frontView: true
    };
  }

  render() {
    const { style } = this.props;
    const { frontView } = this.state;
    // const { onClose } = this.props;
    const sideToggler = frontView ? cx.flipAnim : null;
    const { collectHandler } = this.props;
    const flipHandler = () => {
      console.log('flipHandler');
      this.setState(oldState => ({
        frontView: !oldState.frontView
      }));
    };
    const ToggleCard = do {
      if (frontView) {
        <CardFrame {...this.props} flipHandler={flipHandler}>
          <CardFront {...this.props}>
            <CollectButton onClick={collectHandler} />
          </CardFront>
        </CardFrame>;
      } else {
        <CardFrame {...this.props} flipHandler={flipHandler}>
          <CardBack {...this.props} />
        </CardFrame>;
      }
    };

    return (
      <div
        className={`${cx.flipContainer} ${sideToggler}`}
        style={{ ...style }}
      >
        <div className={`${cx.flipper} ${sideToggler}`}>
          {ToggleCard}
        </div>
      </div>
    );
  }
}

Card.propTypes = {
  ...CardFront.propTypes,
  ...CardBack.propTypes
};

Card.defaultProps = {
  ...CardFront.defaultProps,
  ...CardBack.defaultProps
};

// CardCont.defaultProps = {
//   selected: true
// };

// CardCont.propTypes = { selected: PropTypes.bool };

export { Card, CardFrontPreview, PreviewCard };
