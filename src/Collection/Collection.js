import React from 'react';
import PropTypes from 'prop-types';
import isFunc from 'lodash/isFunction';
import { addItemToList, updateItemInList, substringBetween } from 'reusable-functions';

// a provider that contain several util about collection

const appendCopyLabel = (string) => {
  if (!string.includes('copy')) {
    return `${string} (copy)`;
  }
  const order = substringBetween(string, 'copy', ')');
  if (!order) {
    return string.replace('copy', 'copy 2');
  }
  return string.replace(`copy${order}`, `copy ${parseInt(order, 10) + 1}`);
};

class Collection extends React.Component {
  static defaultProps = {
    initialItems: []
  };

  static propTypes = {
    children: PropTypes.func.isRequired,
    initialItems: PropTypes.arrayOf(PropTypes.any)
  };

  static appendDuplicateName = appendCopyLabel;

  constructor(props) {
    super(props);
    this.state = { items: props.initialItems };
  }

  resetItems = (items, callback) => this.setState({ items }, callback);

  addToIndex = (newItem, index) => {
    // newItem can be an object, string, or array
    // index can be undefined
    this.setState(({ items: stateItems }) => ({
      items: addItemToList(stateItems, newItem, index)
    }));
  };

  onItemChange = (newItem, predicate) => {
    this.setState(({ items: stateItems }) => ({
      items: updateItemInList(
        stateItems,
        predicate,
        isFunc(newItem) ? newItem : () => newItem
      )
    }));
  };

  onItemChangeByIndex = (newItem, index) => {
    this.onItemChange(newItem, (_, i) => i === index);
  };

  duplicateItem = (index, callback = item => item) => this.setState(({ items: stateItems }) => ({
    items: addItemToList(stateItems, callback(stateItems[index]), index + 1)
  }));

  removeItem = predicate => this.setState(({ items: stateItems }) => ({
    items: stateItems.filter((item, index) => !predicate(item, index))
  }));

  removeItemByIndex = index => this.removeItem((_, i) => i === index);

  render() {
    const { items } = this.state;
    const { children } = this.props;
    return (
      children({
        items,
        addToIndex: this.addToIndex,
        duplicateIndex: this.duplicateItem,
        onItemChange: this.onItemChange,
        onItemChangeByIndex: this.onItemChangeByIndex,
        removeItem: this.removeItem,
        removeIndex: this.removeItemByIndex,
        renderItems: items.map((item, index) => ({
          item,
          onDuplicate: newItem => this.duplicateItem(index, () => newItem),
          onChange: newItem => this.onItemChangeByIndex(newItem, index),
          onRemove: () => this.removeItemByIndex(index)
        }))
      })
    );
  }
}

export default Collection;
