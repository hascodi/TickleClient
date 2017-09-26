import React from 'react';

import styl from './StarRating.scss';

export default () => (
  <div className={styl.rating}>
    <input type="radio" id="star5" name="rating" value="5" />
    <label className="full" htmlFor="star5" title="Awesome - 5 stars" />
    <input type="radio" id="star4half" name="rating" value="4 and a half" />
    <label className="half" htmlFor="star4half" title="Pretty good - 4.5 stars" />
    <input type="radio" id="star4" name="rating" value="4" />
    <label className="full" htmlFor="star4" title="Pretty good - 4 stars" />
    <input type="radio" id="star3half" name="rating" value="3 and a half" />
    <label className="half" htmlFor="star3half" title="Meh - 3.5 stars" />
    <input type="radio" id="star3" name="rating" value="3" />
    <label className="full" htmlFor="star3" title="Meh - 3 stars" />
    <input type="radio" id="star2half" name="rating" value="2 and a half" />
  </div>
);
