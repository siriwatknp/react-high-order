import times from 'lodash/times';
import STATES from './status';

export const updateItemByIndex = (array, index, callback) => array.map((item, i) => {
  if (index === i) {
    return callback(item, i);
  }
  return item;
});

export const createInitialStatus = length => times(length, () => ({
  state: null,
  [STATES.INITIAL]: false,
  [STATES.REQUEST]: false,
  [STATES.SUCCESS]: false,
  [STATES.FAILURE]: false
}));
