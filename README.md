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
    + [`Caller`](#caller)
    + [`Collector`](#collector)
    
    
## Render Props
### `Caller`
**`description`** : accept child only as a function and provide wrappedApi, status, ...others to it.
 
**`use case`** : Call api within component

**`parameters`** 

| props             | type                  | default   |
| -------------     |-------------          | -----     |
| children (*)      | fn(options) => react element   | -         |
| api (*)           | fn => promise         | -         |
| onRequest         | fn => void            | () => {}  |
| onSuccess         | fn => void            | () => {}  |
| onFailure         | fn => void            | () => {}  |

**`children options`**

| parameters             | type                  | initial state   | description |
| -------------     |-------------          | -----     | --- |
| wrappedApi         | fn           | -  | the same fn as api from props but wrapped with status
| status          | object         | null         | `{ state:<String: 'isInitial', 'isSuccess', 'isFailure'>, isInitial:<Bool>, isRequest:<Bool>, isSuccess:<Bool>, isFailure:<Bool> }`
| response         | -           | null  | resolve from api
| error         | -            | null  | reject from api
| reset         | fn            | fn  | reset status, response, error to initial state | 

**`example`** 
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

**`Notes`** You can change state of the status by doing this
```js
import { Caller } from 'react-high-order'

Caller.REQUEST = 'isPending'
Caller.SUCCESS = 'isFulfilled'
Caller.FAILURE = 'isFailure'

export default Caller

// then use Caller from above
// the result will be like

import Caller from '../file above';

<Caller>
  {(wrappedApi, { status }) => (
    // status = { isInitial<Bool>, isPending<Bool>, isFulfilled<Bool>, isFailure<Bool> }
  )}
</Caller>
```

### `Collector`
**`description`**
accept child only as a function and provide wrappedAction that you can called later. 

**`use case`**: Show modal before deleting something

**`parameters`** 

| props             | type                  | default   |
| -------------     |-------------          | -----     |
| children (*)      | fn(options) => react element   | -         |
| action (*)           | fn => (promise or void)         | -         |
| actionIsPromise         | bool            | false |
| resetAfterAction         | bool or object            | false  |

**`children options`**

| parameters             | type                  | initial state   | description |
| -------------     |-------------          | -----     | --- |
| wrappedAction          | fn         | -         | the same fn as action from props but wrapped to toggle activated
| collect          | fn         | -         | set activated to true
| reset         | fn           | -  | reset to initial state
| activated         | bool           | false  | a boolean that tell activate sth (such as modal) 

**`example`**
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

### `Collection`

**`description`**
control collection contain adding new item, update, duplicate, remove item

**`use case`**: show list in form that user can add more and edit each item

**`parameters`** 

| props             | type                  | default   |
| -------------     |-------------          | -----     |
| children (*)      | fn(options) => react element   | -         |
| initialItems           | array of string, object         | -         |

**`children options`**

| parameters             | type                  | initial state   | description |
| -------------     |-------------          | -----     | --- |
| items          | array of string, object         | []         | the same format as initialItems
| addToIndex          | fn(newItem, index)         | -         | accept 2 params `newItem`: item that will be added and `index`: index to be added in front 
| duplicateIndex         | fn(index, callback)           | -  | accept 2 params `index`: item index that will be duplicate and `callback`: (item of that index) => new duplicated Item 
| onItemChange         | fn(newItem<fn, string, object>, predicate)           | -  | accept 2 params `newItem`: if it is function accept item that pass predicate and return a new one, else new item `predicate` a predicate to find item to be changed.
| onItemChangeByIndex          | fn(newItem<fn, string, object>, index)         | -         | same as `onItemChange` but change `predicate` to `index` to specify which index to be changed.
| removeItem          | fn(predicate)         | -         | accept 2 params `item` and `index` return true will remove the item
| removeIndex          | fn(index)         | -         | remove the item that is the same as `index`
| renderItems          | array         | -         | a wrapped array that can be used for cleaner code, contain all wrapped function `item`, `onDuplicate`, `onChange`, `onRemove` (check out example for more detail usage)

**`other methods`**   

| name             | type                  | description   |
| -------------     |-------------          | -----     |
| appendDuplicateName      | static fn(name) => name (copy)   | a util fn for append 'copy' to name (use with duplicate method)         |
| resetItems           | fn(items, callback)         | to reset items (using setState internally, so you can inject callback as normal)         |

**`example`**
```js
  <div>
    <h2>Fully Control</h2>
    <Collection
      ref={this._collection1} // you can use ref to access `resetItems`
      initialItems={this.state.items}
    >
      {({ items, addToIndex, onItemChange, duplicateIndex, removeIndex }) => (
        <div>
          <ul>
            {items.map((item, index) => (
              <li key={index}>
                {item.name}
                <button
                  onClick={() => onItemChange({ name: `${item.name}+` }, (_, i) => index === i)}
                >append +
                </button>
                <button onClick={() => duplicateIndex(index, () => ({ name: Collection.appendDuplicateName(item.name) }))}>dup</button>
                <button onClick={() => removeIndex(index)}>remove</button>
              </li>
            ))}
          </ul>
          <button onClick={() => addToIndex({ name: 'test' })}>
            add
          </button>
        </div>
      )}
    </Collection>
    <button onClick={this.reassignItems1}>reset</button>
    <hr />
    <h2>Light Version</h2>
    <Collection
      ref={this._collection2}
      initialItems={this.state.items}
    >
      {({ renderItems, addToIndex }) => (
        <div>
          <ul>
            {renderItems.map((source, index) => {
              const { item, onChange, onRemove, onDuplicate } = source;
              return (
                <li key={index}>
                  {item.name}
                  <button
                    onClick={() => onChange({ name: `${item.name}+` })}
                  >append +
                  </button>
                  <button onClick={() => onDuplicate({ name: Collection.appendDuplicateName(item.name) })}>
                    dup
                  </button>
                  <button onClick={onRemove}>remove</button>
                </li>
              );
            })}
          </ul>
          <button onClick={() => addToIndex({ name: 'test' })}>
            add
          </button>
        </div>
      )}
    </Collection>
    <button onClick={this.reassignItems2}>reset</button>
  </div>
```
