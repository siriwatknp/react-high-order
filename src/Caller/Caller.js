import React from 'react';
import PropTypes from 'prop-types';

const STATES = {
  INITIAL: 'isInitial',
  REQUEST: 'isRequest',
  SUCCESS: 'isSuccess',
  FAILURE: 'isFailure'
};

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
    ...this._status,
    ...status,
    state: Object.keys(status)[0]
  });

  setRequest = () => {
    if (this._isMounted) {
      this.setState({
        status: this.setStatus({ [Caller.REQUEST]: true }),
        response: null,
        error: null
      });
    }
    return this.props.onRequest();
  };

  setSuccess = (response) => {
    if (this._isMounted) {
      this.setState({
        status: this.setStatus({ [Caller.SUCCESS]: true }),
        response
      });
    }
    return this.props.onSuccess(response);
  };

  setFailure = (error) => {
    if (this._isMounted) {
      this.setState({
        status: this.setStatus({ [Caller.FAILURE]: true }),
        error
      });
    }
    this.props.onFailure(error);
    throw error;
  };

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
