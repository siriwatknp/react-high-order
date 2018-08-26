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

class Activator extends React.Component {
  static propTypes = {
    children: PropTypes.func.isRequired,
    actionIsPromise: PropTypes.bool,
    resetAfterAction: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.shape({
        request: PropTypes.bool,
        success: PropTypes.bool,
        failure: PropTypes.bool
      })
    ])
  };

  static defaultProps = {
    actionIsPromise: false,
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
    this.setState(this._initialState);
  };

  createAction = callback => () => {
    const { actionIsPromise, resetAfterAction } = this.props;
    if (actionIsPromise) {
      if (Activator.validate(resetAfterAction, Activator.REQUEST)) {
        this.reset();
      }
      return callback(...this.state.params)
        .then((result) => {
          if (Activator.validate(resetAfterAction, Activator.SUCCESS)) {
            this.reset();
          }
          return Promise.resolve(result);
        })
        .catch((error) => {
          if (Activator.validate(resetAfterAction, Activator.FAILURE)) {
            this.reset();
          }
          throw error;
        });
    }
    if (Activator.validate(resetAfterAction, Activator.SUCCESS)) {
      this.reset();
    }
    return callback(...this.state.params);
  };

  render() {
    const { children } = this.props;
    const { active, params } = this.state;
    return (
      children({
        createAction: this.createAction,
        activate: this.activate,
        active,
        reset: this.reset,
        params
      })
    );
  }
}

export default Activator;
