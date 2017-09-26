import React from 'react';
import { connect } from 'react-redux';
import { addChallenge } from '../actions';

let AddChallenge = ({ dispatch }) => {
  let input;

  return (
    <div className="row">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!input.value.trim()) {
            return;
          }
          dispatch(addChallenge(input.value));
          input.value = '';
        }}
      >
        <input
          ref={(node) => {
            input = node;
          }}
        />
        <button type="submit">
          Add Challenge
        </button>
      </form>
    </div>
  );
};
AddChallenge = connect()(AddChallenge);

export default AddChallenge;
