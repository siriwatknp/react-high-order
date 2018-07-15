# react-high-order

A set of higher order and render props components that will help increasing your productivity on web development.

```
npm install --save react-high-order
```

## Why react-high-order exists ?

In my opinion, React is the best tools for creating modular components that can be combined to something bigger and more complex
 (or maybe because I never use any other front-end library or framework). However, the more you code the more you will ask yourself, 
 "why I have to rewrite the same component or the save behavior for every new project ?". I think it is time for me to create
 real world reusable react components that contain some logic inside such as a component that can call api and provide status to children,
 a component that can collect a function and will be called when user click submit. Let's get started
 
## Example

When you want to create a component that contain simple api calling inside a component you would do this
```js
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
```

But with react-high-order, you only have to do this
```js
    import { Caller } from 'react-high-order'
    
    const Example = () => (
      <Caller api={api}>
        {(wrappedApi, { status, response, error, reset }) => {
          return (
            <div>
              <p>
                {status.isInitial && 'Initialized'}
                {status.isRequest && 'Requesting'}
                {status.isSuccess && 'Success'}
                {status.isFailure && 'Failed!'}
              </p>
              <p>{response}</p>
              {error && (
                <button onClick={reset}>reset</button>
              )}
              <button onClick={wrappedApi}>
                {status === 'requesting' ? 'Requesting...' : 'Call API'}
              </button>
            </div>
          );
        }}
      </Caller>
    )
```
What Caller do is just wrapping the api you provide with status and then transfer to its children.
This technique is officially called as [render props](https://reactjs.org/docs/render-props.html).
The code is more cleaner and declarative, you don't have to be overwhelmed with lots of state.

## API

Mostly react-high-order components will be hoc or using render props technique. The purpose of this repo
is to help you increase your productivity in web development without messing core logic in your app.

### TOC

* Render props
    + [`Caller`](#Caller)
    + [`Collector`](#Collector)
    
    
## Render Props
### `Caller`
usage: Call api within component

accept only child as a function and provide wrappedApi, status to it.
```js
  <Caller api={api}>
    {(wrappedApi, { status, response, error, reset }) => {
      return (
        // You can do whatever you want
        // show status
        // show response
        // show error from api
        // even calling reset  if you want.
      );
    }}
  </Caller>
```

### `Collector`
usage: Show modal before deleting something

accept only child as a function and provide wrappedAction.
```js
<Collector action={deleteApi}>
    {(wrappedAction, { collect, reset, activated }) => (
      <div>
        <Modal open={activated}>
          <button onClick={wrappedAction}>call action</button>
          <button onClick={reset}>cancel</button>
        </Modal>  
        <div>
          <button onClick={collect}>activate</button>
        </div>
      </div>
    )}
</Collector>
```


