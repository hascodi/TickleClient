import React from 'react';

const Modal = ({ content, closeHandler }) => (
  <div className={`w3-modal ${content ? 'w3-show' : 'w3-hide'}`}>
    <div className="">
      <div className="w3-container">
        <span
          onClick={closeHandler}
          className="w3-closebtn"
        >
                  &times;
                </span>
        {content || null}
      </div>
    </div>
  </div>);


Modal.propTypes = {
  content: React.PropTypes.element || false,
  closeHandler: React.PropTypes.func
};

Modal.defaultProps = {
  content: <div>ExampleModal</div>,
  closeHandler: () => null
};

export default Modal;
