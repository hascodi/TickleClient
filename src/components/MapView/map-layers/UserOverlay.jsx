import React from 'react';
// const window = require('global/window');
import DIVOverlay from './div.react';

const UserMarker = (props) => {
  function redraw(opt) {
    const pixel = opt.project([props.location.longitude, props.location.latitude]);
    return (
      <i
        style={{
          transform: `translate(${pixel[0]}px, ${pixel[1]}px)`
        }}
        className="fa fa-street-view fa-2x" aria-hidden="true"
      />
    );
  }
  return <DIVOverlay {...props} redraw={redraw} />;
};


UserMarker.propTypes = {
  location: React.PropTypes.object.isRequired
};

export default UserMarker;
