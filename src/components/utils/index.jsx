import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import Grid from './Grid';

const Modal = ({ visible, children, closeHandler }) =>
  <div
    className="modal"
    tabIndex="-1"
    style={{ display: visible ? 'block' : 'none', zIndex: '4000' }}
  >
    <div className="modal-dialog" role="document">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title" id="exampleModalLabel">
            Modal title
          </h5>
          <button
            type="button"
            className="close"
            data-dismiss="modal"
            aria-label="Close"
            onClick={closeHandler}
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div className="modal-body">
          {/* TODO: include real game */}
          {children}
        </div>
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary"
            data-dismiss="modal"
          >
            Close
          </button>
          <button type="button" className="btn btn-primary">
            Save changes
          </button>
        </div>
      </div>
    </div>
  </div>;

Modal.propTypes = {
  children: PropTypes.element.isRequired,
  visible: PropTypes.bool.isRequired,
  closeHandler: PropTypes.func.isRequired
};

Modal.defaultProps = {
  id: 'exampleModal',
  children: (
    <div>
      {'Modal'}
    </div>
  ),
  closeHandler: d => d
};

class Wrapper extends React.Component {
  static propTypes = {
    children: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = { width: 0, height: 0 };
  }

  componentDidMount() {
    const node = ReactDOM.findDOMNode(this);
    const width = node.offsetWidth;
    const height = node.offsetHeight;
    this.setState({ width, height });
  }

  render() {
    const { children } = this.props;
    const { width, height } = this.state;
    return (
      <div style={{ height: '100%', width: '100%' }}>
        {children(width, height)}
      </div>
    );
  }
}


export { Modal, Wrapper, Grid};
