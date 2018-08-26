/* eslint-disable arrow-body-style,function-paren-newline */
import React from 'react';
import isNull from 'lodash/isNull';
import PropTypes from 'prop-types';
import times from 'lodash/times';
import get from 'lodash/get';
import Caller from '../Caller/Caller';
import STATES from '../helpers/status';
import {
  updateItemByIndex,
  createInitialStatus
} from '../helpers/functions';

class MultiCaller extends React.Component {
  static defaultProps = {
    onDidMount: undefined,
    onRequest: undefined,
    onSuccess: undefined,
    onFailure: undefined
  };

  static propTypes = {
    api: PropTypes.arrayOf(PropTypes.func.isRequired).isRequired,
    onDidMount: PropTypes.func,
    onRequest: PropTypes.arrayOf(PropTypes.func),
    onSuccess: PropTypes.arrayOf(PropTypes.func),
    onFailure: PropTypes.arrayOf(PropTypes.func),
    children: PropTypes.func.isRequired
  };

  static INITIAL = STATES.INITIAL;
  static REQUEST = STATES.REQUEST;
  static SUCCESS = STATES.SUCCESS;
  static FAILURE = STATES.FAILURE;

  constructor(props) {
    super(props);

    this._status = {
      state: null,
      [Caller.INITIAL]: false,
      [Caller.REQUEST]: false,
      [Caller.SUCCESS]: false,
      [Caller.FAILURE]: false
    };
    this._statusList = createInitialStatus(props.api.length);
    this._isMounted = null;
    this._initialState = {
      status: this.setInitialStatus(),
      response: this.setInitialNull(),
      error: this.setInitialNull()
    };
    this[`_${Caller.REQUEST}`] = this.createOnCallback(props.onRequest);
    this[`_${Caller.SUCCESS}`] = this.createOnCallback(props.onSuccess);
    this[`_${Caller.FAILURE}`] = this.createOnCallback(props.onFailure);
    this.state = this._initialState;
  }

  componentDidMount() {
    this._isMounted = true;
    const { onDidMount, ...rest } = this.props;
    if (onDidMount) {
      onDidMount(rest);
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  createOnCallback = (callback) => {
    const { api } = this.props;
    return times(api.length, (i) => {
      const value = get(callback, `[${i}]`);
      return value || (() => {});
    });
  };

  setInitialNull = () => {
    const { api } = this.props;
    return times(api.length, () => null);
  };
  setInitialStatus = () => this._statusList.map(item => ({
    ...item,
    [Caller.INITIAL]: true,
    state: Caller.INITIAL
  }));

  // change some state in status to true
  setStatus = status => ({
    ...this._status,
    ...status,
    state: Object.keys(status)[0]
  });

  // return updated status depends on newStatus
  getUpdatedStatus = newStatus => () => {
    if (isNull(newStatus)) {
      return this.setStatus({ [Caller.INITIAL]: true });
    }
    return this.setStatus(newStatus);
  };

  updateStatusByIndex = (currentStatus, index, newStatus) => {
    return updateItemByIndex(
      currentStatus,
      index,
      this.getUpdatedStatus(newStatus)
    );
  };

  // return the whole new state when triggered
  setValue = (
    index,
    currentState,
    newStatus,
    responseCallback = res => res,
    errorCallback = err => err) => {
    // adjust status by index
    // adjust response by index
    // adjust error by index
    return {
      ...currentState,
      status: this.updateStatusByIndex(currentState.status, index, newStatus),
      response: updateItemByIndex(
        currentState.response,
        index,
        response => responseCallback(response)
      ),
      error: updateItemByIndex(
        currentState.error,
        index,
        error => errorCallback(error)
      )
    };
  };

  createStateTrigger = (status, ...args) => (index) => {
    if (this._isMounted) {
      this.setState(state => this.setValue(
        index,
        state,
        isNull(status) ? status : { [status]: true },
        ...args
      ));
    }
    return status ? this[`_${status}`][index]({ ...this.props, ...this.state }) : {};
  };

  createSetRequest = this.createStateTrigger(Caller.REQUEST, () => null, () => null);
  createSetSuccess = response => this.createStateTrigger(Caller.SUCCESS, () => response);
  createSetFailure = error => this.createStateTrigger(Caller.FAILURE, undefined, () => error);

  wrapApi = () => {
    // wrap all api in list to correctly setState in array
    const { api } = this.props;
    return api.map((singleApi, index) => (...args) => {
      // set is request to status index
      this.createSetRequest(index);
      return singleApi(...args)
        .then(res => this.createSetSuccess(res)(index))
        .catch(err => this.createSetFailure(err)(index));
    });
  };

  resetIndex = this.createStateTrigger(null, () => null, () => null);

  resetAll = () => this.setState({
    status: this.setInitialStatus(),
    response: this.setInitialNull(),
    error: this.setInitialNull()
  });

  render() {
    const { children } = this.props;
    const { status, response, error } = this.state;
    return (
      children({
        wrappedApi: this.wrapApi(),
        status,
        response,
        error,
        resetIndex: this.resetIndex,
        resetAll: this.resetAll
      })
    );
  }
}

export default MultiCaller;
