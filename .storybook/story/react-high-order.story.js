import React from 'react';
import { storiesOf } from '@storybook/react';
import {
  select,
  boolean,
  text,
  button
} from '@storybook/addon-knobs/react';

import Caller from '../../src/Caller';

// Caller.REQUEST = 'isPending'
// Caller.SUCCESS = 'isFulfilled'
// Caller.FAILURE = 'isRejected'

const api = (shouldResolve = true) => {
  console.log('called');
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldResolve) {
        resolve('success');
      } else {
        reject('failed');
      }
    }, 1000);
  });
};

storiesOf('React-High-Order', module)
  .add(
    'Caller',
    () => {
      return (
        <Caller
          api={() => api(false)}
          startCallerWhenMount={boolean('start caller when mount', false)}
        >
          {(wrappedApi, { status, response, error, reset }) => {
            console.log('status', status);
            console.log('response', response);
            console.log('error', error);
            return (
              <div>
                <p>
                  {status.isInitial && 'Initialized'}
                  {status.isRequest && 'Requesting'}
                  {status.isSuccess && 'Success'}
                  {status.isFailure && 'Failed!'}
                </p>
                {error && (
                  <button onClick={reset}>reset</button>
                )}
                {button('call api', wrappedApi)}
              </div>
            );
          }}
        </Caller>
      );
    }
  );
