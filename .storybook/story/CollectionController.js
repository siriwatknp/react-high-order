import React from 'react';
import Collection from '../../src/Collection';

class CollectionController extends React.Component {
  static defaultProps = {};

  static propTypes = {};

  constructor() {
    super();

    this._collection1 = React.createRef();
    this._collection2 = React.createRef();
  }

  state = {
    items: [
      { name: 'hello' }
    ]
  };

  reassignItems1 = () => {
    this._collection1.current.resetItems([{ name: 'new hello' }]);
  };

  reassignItems2 = () => {
    this._collection2.current.resetItems([{ name: 'new hello' }]);
  };

  render() {
    return (
      <div>
        <h2>Fully Control</h2>
        <Collection
          ref={this._collection1}
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
    );
  }
}

export default CollectionController;
