/* eslint-disable */
import React from 'react';
import PropTypes from 'prop-types';
import STATES from '../helpers/status';

class Caller extends React.Component {
  static defaultProps = {
    onRequest: () => {},
    onSuccess: () => {},
    onFailure: () => {},
    startCallerWhenMount: false
  };

  static propTypes = {
    onRequest: PropTypes.func,
    onSuccess: PropTypes.func,
    onFailure: PropTypes.func,
    startCallerWhenMount: PropTypes.bool,
    api: PropTypes.func.isRequired,
    children: PropTypes.func.isRequired
  };

  static INITIAL = STATES.INITIAL;
  static REQUEST = STATES.REQUEST;
  static SUCCESS = STATES.SUCCESS;
  static FAILURE = STATES.FAILURE;

  constructor() {
    super();

    // create this._status, so we can change constant value from outside
    // and use throughout the component
    this._status = {
      state: null,
      [Caller.INITIAL]: false,
      [Caller.REQUEST]: false,
      [Caller.SUCCESS]: false,
      [Caller.FAILURE]: false
    };
    this._isMounted = null;
    this._initialState = {
      status: this.setStatus({ [Caller.INITIAL]: true }),
      response: null,
      error: null
    };
    this.state = this._initialState;
  }

  reset = () => this.setState(this._initialState);

  setStatus = status => ({
    // everytime state is set, only one status will be true
    // that's why we use this._status as model.
    ...this._status,
    ...status,
    state: Object.keys(status)[0]
  });

  returnByStatus = (status, value) => {
    switch (status) {
      case Caller.REQUEST:
        return {
          response: null,
          error: null
        };
      case Caller.SUCCESS:
        return { response: value };
      case Caller.FAILURE:
        return { error: value };
      default:
        return {};
    }
  };

  createStateTrigger = (status, callback) => (value) => {
    if (this._isMounted) {
      this.setState({
        status: this.setStatus({ [status]: true }),
        ...this.returnByStatus(status, value)
      });
    }
    return callback(this.props);
  };

  setRequest = this.createStateTrigger(Caller.REQUEST, ({ onRequest }) => onRequest());
  setSuccess = this.createStateTrigger(Caller.SUCCESS, ({ onSuccess }) => onSuccess());
  setFailure = this.createStateTrigger(Caller.FAILURE, ({ onFailure }) => onFailure());

  callApi = () => {
    this.setRequest();
    return this.props.api()
      .then(this.setSuccess)
      .catch(this.setFailure);
  };

  componentDidMount() {
    this._isMounted = true;
    const { startCallerWhenMount } = this.props;
    if (startCallerWhenMount) {
      this.callApi();
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    const { children } = this.props;
    const { status, response, error } = this.state;
    return (
      children({
        wrappedApi: this.callApi,
        status,
        response,
        error,
        reset: this.reset
      })
    );
  }
}

// You can reset status like this
// Caller.REQUEST = 'isPending'
// Caller.SUCCESS = 'isFulfilled'
// Caller.FAILURE = 'isRejected'

// the result would be status.isPending, status.isFulfilled, status.isRejected
// status.isInitial is still the same

export default Caller;
