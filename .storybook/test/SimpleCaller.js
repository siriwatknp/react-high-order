import React from 'react';
import pick from 'lodash/pick';

// CONTROLLERS
import JsonViewer from '../controllers/JsonViewer';
import { Caller } from '../../src/index';

// COMPONENTS
import Button from '@material-ui/core/Button';

import { getComments } from '../api';

const SimpleCaller = ({
  startCallerWhenMount
}) => {
  return (
    <JsonViewer>
      {({ displayJson }) => {
        const wrapDisplayJson = (object) => {
          const json = pick(object, ['status', 'response', 'error']);
          displayJson(json);
        };
        return (
          <Caller
            api={getComments}
            startCallerWhenMount={startCallerWhenMount}
            onDidMount={wrapDisplayJson}
            onRequest={wrapDisplayJson}
            onSuccess={wrapDisplayJson}
            onFailure={wrapDisplayJson}
          >
            {({ wrappedApi, status, response, error, reset }) => {
              const decoratedReset = () => reset(wrapDisplayJson);
              return (
                <div>
                  <p>
                    {status.isInitial && 'Initialized'}
                    {status.isRequest && 'Requesting'}
                    {status.isSuccess && 'Success'}
                    {status.isFailure && 'Failed!'}
                  </p>
                  <Button variant={'contained'} color={'primary'} onClick={wrappedApi}>
                    Call Api
                  </Button>
                  {error && (
                    <Button onClick={decoratedReset}>
                      Reset Status
                    </Button>
                  )}
                </div>
              );
            }}
          </Caller>
        )
      }}
    </JsonViewer>
  );
};

export default SimpleCaller;
