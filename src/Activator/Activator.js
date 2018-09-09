import React from 'react';
import PropTypes from 'prop-types';
import isBoolean from 'lodash/isBoolean';

// Purpose of this component

// for opening modal or confirm sth before calling the action
// accept external action and wrapped that action with reset function
// dev can decide when to reset (if action is promise) whether success or failure
// action can be pure function or promise

const STATES = {
  REQUEST: 'isRequest',
  SUCCESS: 'isSuccess',
  FAILURE: 'isFailure'
};

function isPromise(obj) {
  return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
}

class Activator extends React.Component {
  static propTypes = {
    children: PropTypes.func.isRequired,
    resetAfterAction: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.shape({
        isRequest: PropTypes.bool,
        isSuccess: PropTypes.bool,
        isFailure: PropTypes.bool
      })
    ])
  };

  static defaultProps = {
    resetAfterAction: false
  };

  static REQUEST = STATES.REQUEST;
  static SUCCESS = STATES.SUCCESS;
  static FAILURE = STATES.FAILURE;

  static validate = (value, field) => {
    if (isBoolean(value)) {
      return value;
    }
    return value[field];
  };

  constructor() {
    super();
    this._initialState = {
      active: false,
      params: null
    };
    this.state = this._initialState;
  }

  activate = (...params) => {
    this.setState({
      active: true,
      params
    });
  };

  reset = () => {
    this.setState({ active: false });
  };

  decorate = callback => (...args) => {
    const { resetAfterAction } = this.props;
    const result = callback(...args);
    if (isPromise(result)) {
      if (Activator.validate(resetAfterAction, Activator.REQUEST)) {
        this.reset();
      }
      return result
        .then((value) => {
          console.log('hello');
          if (Activator.validate(resetAfterAction, Activator.SUCCESS)) {
            this.reset();
          }
          return Promise.resolve(value);
        })
        .catch((error) => {
          if (Activator.validate(resetAfterAction, Activator.FAILURE)) {
            this.reset();
          }
          throw error;
        });
    }
    if (Activator.validate(resetAfterAction)) {
      this.reset();
    }
    return result;
  };

  render() {
    const { children } = this.props;
    const { active, params } = this.state;
    return (
      children({
        decorate: this.decorate,
        activate: this.activate,
        active,
        reset: this.reset,
        params
      })
    );
  }
}

export default Activator;
