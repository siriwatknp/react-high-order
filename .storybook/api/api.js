import isBool from 'lodash/isBoolean'
import { comments, error } from '../data/index';

export const getComments = (shouldReject) => new Promise((resolve, reject) => {
  return setTimeout(() => {
    if (isBool(shouldReject) && shouldReject) {
      return reject(error)
    }
    return resolve(comments)
  }, 2000)
});

export const deleteComment = (comments, commentId) => new Promise((resolve) => {
  return setTimeout(() => {
    resolve(comments.filter(({ id }) => id !== commentId))
  }, 2000)
});
