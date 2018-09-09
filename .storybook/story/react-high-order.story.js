import React from 'react';
import { storiesOf } from '@storybook/react';
import {
  select,
  boolean,
  text,
  button,
  object
} from '@storybook/addon-knobs/react';

import Caller from '../../src/Caller';
import Activator from '../../src/Activator';
import CollectionController from './CollectionController';
import MultiCaller from '../../src/MultiCaller';

// Caller.REQUEST = 'isPending'
// Caller.SUCCESS = 'isFulfilled'
// Caller.FAILURE = 'isRejected'

const api = (shouldResolve = true) => {
  console.log('called');
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldResolve) {
        console.log('Resolve');
        resolve('success');
      } else {
        console.log('Reject');
        reject('failed');
      }
    }, 1000);
  });
};

const deleteApi = (item) => {
  console.log('called');
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(item + ' is deleted');
    }, 1000);
  });
};

storiesOf('React-High-Order', module)
  .add(
    'Collection',
    () => {
      return (
        <CollectionController />
      );
    }
  )
  .add(
    'Caller + Activator',
    () => {
      return (
        <Caller
          api={() => api(false)}
          startCallerWhenMount={boolean('start caller when mount', false)}
        >
          {({ wrappedApi, status, response, error, reset: resetCaller }) => {
            return (
              <Activator resetAfterAction={object('reset after action', { isSuccess: true })}>
                {({ activate, active, decorate, params, reset }) => {
                  const catchApi = () => (
                    decorate(wrappedApi)(...params)
                      .catch((error) => console.log('error', error))
                  );
                  return (
                    <div>
                      {active && (
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
                              <button onClick={catchApi}>try again</button>
                            </div>
                          )}
                          <div style={{
                            marginTop: 18,
                            display: 'flex',
                            justifyContent: 'space-between'
                          }}>
                            <button onClick={catchApi}>
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
                            activate();
                          }}
                        >
                          activate
                        </button>
                      </div>
                    </div>
                  );
                }}
              </Activator>
            );
          }}
        </Caller>
      );
    }
  )
  .add('Multi Caller', () => (
    <MultiCaller
      api={[
        api,
        deleteApi
      ]}
      onSuccess={[
        ,
        () => console.log('yeah!')
      ]}
    >
      {({ wrappedApi, status, response, error, resetAll }) => {
        console.log('status', status);
        console.log('response', response);
        console.log('error', error);
        const [api, deleteApi] = wrappedApi;
        return (
          <div>
            {error && (
              <button onClick={resetAll}>reset</button>
            )}
            {button('call api1', api)}
            {button('call api2', deleteApi)}
          </div>
        );
      }}
    </MultiCaller>
  ));

