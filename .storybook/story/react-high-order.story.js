import React from 'react';
import { storiesOf } from '@storybook/react';
import {
  select,
  boolean,
  text,
  button
} from '@storybook/addon-knobs/react';

import Caller from '../../src/Caller';
import Collector from '../../src/Collector';

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
          {({ wrappedApi, status, response, error, reset }) => {
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
  )
  .add(
    'Collector',
    () => {
      return (
        <Collector
          action={api}
        >
          {({ wrappedAction, collect, reset, activated }) => (
            <div>
              {activated && (
                <div>
                  <button onClick={wrappedAction}>call action</button>
                  <button onClick={reset}>cancel</button>
                </div>
              )}
              <div style={{ marginTop: 40 }}>
                <button onClick={collect}>activate</button>
              </div>
            </div>
          )}
        </Collector>
      );
    }
  )
  .add(
    'Caller + Collector',
    () => {
      return (
        <Caller
          api={() => api(false)}
          startCallerWhenMount={boolean('start caller when mount', false)}
        >
          {({ wrappedApi, status, response, error, reset: resetCaller }) => {
            return (
              <Collector
                action={wrappedApi}
                actionIsPromise
                resetAfterAction={{
                  success: true,
                  failure: false
                }}
              >
                {({ wrappedAction, collect, reset, activated }) => (
                  <div>
                    {activated && (
                      <div style={{
                        padding: 18,
                        border: '1px solid #f5f5f5'
                      }}>
                        {error && (
                          <div style={{
                            padding: 18,
                            boxShadow: '0 0 10px 0 rgba(0,0,0,0.12)'
                          }}>
                            <p>error please try again</p>
                            <button onClick={wrappedAction}>try again</button>
                          </div>
                        )}
                        <div style={{
                          marginTop: 18,
                          display: 'flex',
                          justifyContent: 'space-between'
                        }}>
                          <button onClick={wrappedAction}>
                            {status.isRequest ? 'calling...' : 'call action'}
                          </button>
                          <button onClick={reset}>cancel</button>
                        </div>
                      </div>
                    )}
                    <div style={{ marginTop: 40 }}>
                      <button
                        onClick={() => {
                          resetCaller();
                          collect();
                        }}
                      >
                        activate
                      </button>
                    </div>
                  </div>
                )}
              </Collector>
            );
          }}
        </Caller>
      );
    }
  );

