import React from 'react';
import PropTypes from 'prop-types';
import isBoolean from 'lodash/isBoolean';

class Collector extends React.Component {
  static propTypes = {
    children: PropTypes.func.isRequired,
    action: PropTypes.func.isRequired,
    actionIsPromise: PropTypes.bool,
    resetAfterAction: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.shape({
        success: PropTypes.bool,
        failure: PropTypes.bool
      })
    ])
  };

  static defaultProps = {
    actionIsPromise: false,
    resetAfterAction: false
  };

  static validate = (value, field) => {
    if (isBoolean(value)) {
      return value;
    }
    return value[field];
  };

  constructor() {
    super();
    this._initialState = { activated: false };
    this.state = this._initialState;
  }

  collect = () => {
    this.setState({ activated: true });
  };

  reset = () => {
    this.setState(this._initialState);
  };

  callAction = () => {
    const { actionIsPromise, action, resetAfterAction } = this.props;
    if (actionIsPromise) {
      action()
        .then((result) => {
          if (Collector.validate(resetAfterAction, 'success')) {
            this.reset();
          }
          return Promise.resolve(result);
        })
        .catch((error) => {
          if (Collector.validate(resetAfterAction, 'failure')) {
            this.reset();
          }
          throw error;
        });
    } else {
      action();
      if (Collector.validate(resetAfterAction, 'success')) {
        this.reset();
      }
    }
  };

  render() {
    const { children } = this.props;
    const { activated } = this.state;
    return (
      children({
        wrappedAction: this.callAction,
        collect: this.collect,
        activated,
        reset: this.reset
      })
    );
  }
}

export default Collector;
