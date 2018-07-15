import React from 'react';

const api = () => new Promise((resolve) => {
  resolve('response from api');
});

class Example extends React.Component {

  static propTypes = {};

  state = {
    status: 'initialized',
    error: null,
    response: null
  };

  callApi = () => {
    this.setState({ status: 'requesting' });
    api()
      .then((response) => this.setState({
        response,
        status: 'success'
      }))
      .catch((error) => this.setState({
        error,
        status: 'failure'
      }));
  };

  render() {
    const { status, response, error } = this.state;
    return (
      <div>
        <p>{status}</p>
        {response && (
          <p>
            {/* or render something else */}
            {response}
          </p>
        )}
        {error && (
          <p>{error}</p>
        )}
        <button onClick={this.callApi}>
          {status === 'requesting' ? 'Requesting...' : 'Call API'}
        </button>
      </div>
    );
  }
}

export default Example;
