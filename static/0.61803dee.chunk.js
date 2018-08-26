webpackJsonp([0],{783:function(e,n,t){var a=t(15),o=t(45),i=t(289).PageRenderer;i.__esModule&&(i=i.default);var r=o({displayName:"WrappedPageRenderer",getInitialState:function(){return{content:t(784)}},componentWillMount:function(){},render:function(){return a.createElement(i,Object.assign({},this.props,{content:this.state.content}))}});r.__catalog_loader__=!0,e.exports=r},784:function(e,n){e.exports="# react-high-order\n\nA set of higher order and render props components that will help increasing your productivity on web development.\n\n```\nnpm install --save react-high-order\n```\n\n## Why react-high-order exists ?\n\nIn my opinion, React is the best tools for creating modular components that can be combined to something bigger and more complex\n (or maybe because I never use any other front-end library or framework). However, the more you code the more you will ask yourself, \n \"why I have to rewrite the same component or the save behavior for every new project ?\". I think it is time for me to create\n real world reusable react components that contain some logic inside such as a component that can call api and provide status to children,\n a component that can collect a function and will be called when user click submit. Let's get started\n \n## Example\n\nWhen you want to create a component that contain simple api calling inside a component you would do this\n```js\n    const api = () => new Promise((resolve) => {\n      resolve('response from api');\n    });\n    \n    class Example extends React.Component {\n    \n      static propTypes = {};\n    \n      state = {\n        status: 'initialized',\n        error: null,\n        response: null\n      };\n    \n      callApi = () => {\n        this.setState({ status: 'requesting' });\n        api()\n          .then((response) => this.setState({\n            response,\n            status: 'success'\n          }))\n          .catch((error) => this.setState({\n            error,\n            status: 'failure'\n          }));\n      };\n    \n      render() {\n        const { status, response, error } = this.state;\n        return (\n          <div>\n            <p>{status}</p>\n            {response && (\n              <p>\n                {/* or render something else */}\n                {response}\n              </p>\n            )}\n            {error && (\n              <p>{error}</p>\n            )}\n            <button onClick={this.callApi}>\n              {status === 'requesting' ? 'Requesting...' : 'Call API'}\n            </button>\n          </div>\n        );\n      }\n    }\n```\n\nBut with react-high-order, you only have to do this\n```js\n    import { Caller } from 'react-high-order'\n    \n    const Example = () => (\n      <Caller api={api}>\n        {(wrappedApi, { status, response, error, reset }) => {\n          return (\n            <div>\n              <p>\n                {status.isInitial && 'Initialized'}\n                {status.isRequest && 'Requesting'}\n                {status.isSuccess && 'Success'}\n                {status.isFailure && 'Failed!'}\n              </p>\n              <p>{response}</p>\n              {error && (\n                <button onClick={reset}>reset</button>\n              )}\n              <button onClick={wrappedApi}>\n                {status === 'requesting' ? 'Requesting...' : 'Call API'}\n              </button>\n            </div>\n          );\n        }}\n      </Caller>\n    )\n```\nWhat Caller do is just wrapping the api you provide with status and then transfer to its children.\nThis technique is officially called as [render props](https://reactjs.org/docs/render-props.html).\nThe code is more cleaner and declarative, you don't have to be overwhelmed with lots of state.\n\n## API\n\nMostly react-high-order components will be hoc or using render props technique. The purpose of this repo\nis to help you increase your productivity in web development without messing core logic in your app.\n\n### TOC\n\n* Render props\n    + [`Caller`](#caller)\n    + [`Collector`](#collector)\n    \n    \n## Render Props\n### `Caller`\n**`description`** : accept child only as a function and provide wrappedApi, status, ...others to it.\n \n**`use case`** : Call api within component\n\n**`parameters`** \n\n| props             | type                  | default   |\n| -------------     |-------------          | -----     |\n| children (*)      | fn(options) => react element   | -         |\n| api (*)           | fn => promise         | -         |\n| onRequest         | fn => void            | () => {}  |\n| onSuccess         | fn => void            | () => {}  |\n| onFailure         | fn => void            | () => {}  |\n\n**`children options`**\n\n| parameters             | type                  | initial state   | description |\n| -------------     |-------------          | -----     | --- |\n| wrappedApi         | fn           | -  | the same fn as api from props but wrapped with status\n| status          | object         | null         | `{ state:<String: 'isInitial', 'isSuccess', 'isFailure'>, isInitial:<Bool>, isRequest:<Bool>, isSuccess:<Bool>, isFailure:<Bool> }`\n| response         | -           | null  | resolve from api\n| error         | -            | null  | reject from api\n| reset         | fn            | fn  | reset status, response, error to initial state | \n\n**`example`** \n```js\n  <Caller api={api}>\n    {(wrappedApi, { status, response, error, reset }) => {\n      return (\n        // You can do whatever you want\n        // show status\n        // show response\n        // show error from api\n        // even calling reset  if you want.\n      );\n    }}\n  </Caller>\n```\n\n**`Notes`** You can change state of the status by doing this\n```js\nimport { Caller } from 'react-high-order'\n\nCaller.REQUEST = 'isPending'\nCaller.SUCCESS = 'isFulfilled'\nCaller.FAILURE = 'isFailure'\n\nexport default Caller\n\n// then use Caller from above\n// the result will be like\n\nimport Caller from '../file above';\n\n<Caller>\n  {(wrappedApi, { status }) => (\n    // status = { isInitial<Bool>, isPending<Bool>, isFulfilled<Bool>, isFailure<Bool> }\n  )}\n</Caller>\n```\n\n### `Activator`\n**`description`**\naccept child only as a function and provide 'createAction' that you can input callback to call. \n\n**`use case`**: Show modal before deleting something (great for using with Caller)\n\n**`parameters`** \n\n| props             | type                  | default   |\n| -------------     |-------------          | -----     |\n| children (*)      | fn(options) => react element   | -         |\n| action (*)           | fn => (promise or void)         | -         |\n| actionIsPromise         | bool            | false |\n| resetAfterAction         | bool or object            | false  |\n\n**`children options`**\n\n| parameters             | type                  | initial state   | description |\n| -------------     |-------------          | -----     | --- |\n| activate          | fn         | -         | set activated to true and can accept params and store it for later use\n| active         | bool           | false  | a boolean that tell activate sth (such as modal)\n| createAction          | fn         | -         | the same fn as action from props but wrapped to toggle activated\n| reset         | fn           | -  | reset to initial state\n| params         | array           | null  | array of params that you provide when use activate(...params) \n\n**`example`**\n```js\n<Activator actionIsPromise resetAfterAction={{ isRequest: true }}>\n    {({ activate, active, params, createAction, reset }) => (\n      // params[0] = 'item to delete'\n      <div>\n        <Modal open={active}>\n          <button onClick={createAction(deleteApi)}>call action</button> // deleteApi will receive 'item to delete' as first parameter\n          <button onClick={reset}>cancel</button>\n        </Modal>  \n        <div>\n          <button onClick={() => activate('item to delete')}>activate</button>\n        </div>\n      </div>\n    )}\n</Activator>\n```\nYou can change static status in Activator as same as Caller\n\n### `Collection`\n\n**`description`**\ncontrol collection contain adding new item, update, duplicate, remove item\n\n**`use case`**: show list in form that user can add more and edit each item\n\n**`parameters`** \n\n| props             | type                  | default   |\n| -------------     |-------------          | -----     |\n| children (*)      | fn(options) => react element   | -         |\n| initialItems           | array of string, object         | -         |\n\n**`children options`**\n\n| parameters             | type                  | initial state   | description |\n| -------------     |-------------          | -----     | --- |\n| items          | array of string, object         | []         | the same format as initialItems\n| addToIndex          | fn(newItem, index)         | -         | accept 2 params `newItem`: item that will be added and `index`: index to be added in front \n| duplicateIndex         | fn(index, callback)           | -  | accept 2 params `index`: item index that will be duplicate and `callback`: (item of that index) => new duplicated Item \n| onItemChange         | fn(newItem<fn, string, object>, predicate)           | -  | accept 2 params `newItem`: if it is function accept item that pass predicate and return a new one, else new item `predicate` a predicate to find item to be changed.\n| onItemChangeByIndex          | fn(newItem<fn, string, object>, index)         | -         | same as `onItemChange` but change `predicate` to `index` to specify which index to be changed.\n| removeItem          | fn(predicate)         | -         | accept 2 params `item` and `index` return true will remove the item\n| removeIndex          | fn(index)         | -         | remove the item that is the same as `index`\n| renderItems          | array         | -         | a wrapped array that can be used for cleaner code, contain all wrapped function `item`, `onDuplicate`, `onChange`, `onRemove` (check out example for more detail usage)\n\n**`other methods`**   \n\n| name             | type                  | description   |\n| -------------     |-------------          | -----     |\n| appendDuplicateName      | static fn(name) => name (copy)   | a util fn for append 'copy' to name (use with duplicate method)         |\n| resetItems           | fn(items, callback)         | to reset items (using setState internally, so you can inject callback as normal)         |\n\n**`example`**\n```js\n  <div>\n    <h2>Fully Control</h2>\n    <Collection\n      ref={this._collection1} // you can use ref to access `resetItems`\n      initialItems={this.state.items}\n    >\n      {({ items, addToIndex, onItemChange, duplicateIndex, removeIndex }) => (\n        <div>\n          <ul>\n            {items.map((item, index) => (\n              <li key={index}>\n                {item.name}\n                <button\n                  onClick={() => onItemChange({ name: `${item.name}+` }, (_, i) => index === i)}\n                >append +\n                </button>\n                <button onClick={() => duplicateIndex(index, () => ({ name: Collection.appendDuplicateName(item.name) }))}>dup</button>\n                <button onClick={() => removeIndex(index)}>remove</button>\n              </li>\n            ))}\n          </ul>\n          <button onClick={() => addToIndex({ name: 'test' })}>\n            add\n          </button>\n        </div>\n      )}\n    </Collection>\n    <button onClick={this.reassignItems1}>reset</button>\n    <hr />\n    <h2>Light Version</h2>\n    <Collection\n      ref={this._collection2}\n      initialItems={this.state.items}\n    >\n      {({ renderItems, addToIndex }) => (\n        <div>\n          <ul>\n            {renderItems.map((source, index) => {\n              const { item, onChange, onRemove, onDuplicate } = source;\n              return (\n                <li key={index}>\n                  {item.name}\n                  <button\n                    onClick={() => onChange({ name: `${item.name}+` })}\n                  >append +\n                  </button>\n                  <button onClick={() => onDuplicate({ name: Collection.appendDuplicateName(item.name) })}>\n                    dup\n                  </button>\n                  <button onClick={onRemove}>remove</button>\n                </li>\n              );\n            })}\n          </ul>\n          <button onClick={() => addToIndex({ name: 'test' })}>\n            add\n          </button>\n        </div>\n      )}\n    </Collection>\n    <button onClick={this.reassignItems2}>reset</button>\n  </div>\n```\n"}});
//# sourceMappingURL=0.61803dee.chunk.js.map