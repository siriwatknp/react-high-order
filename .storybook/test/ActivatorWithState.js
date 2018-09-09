import React from 'react';

import ReactJson from 'react-json-view'

// CONTAINERS
import withStateProvider from '../controllers/withStateProvider'

// COMPONENTS
import Button from '@material-ui/core/Button'
import Modal from '../components/Modal'
import { Activator } from '../../src/index'

// CONSTANTS
import { comments } from '../data';

const ActivatorWithState = ({
  value,
  onChangeState,
  resetAfterAction,
}) => {
  return (
    <Activator resetAfterAction={resetAfterAction}>
      {({
        active,
        activate,
        decorate,
        params,
        reset,
      }) => (
        <div>
          <Button variant={'contained'} onClick={activate}>
            Trigger Modal Before Action
          </Button>
          {params && (
            <div>
              <h3 style={{ marginTop: 30 }}>Params</h3>
              <ReactJson
                src={params.map((item) => {
                  if (Object.keys(item).length > 15){
                    return 'event'
                  }
                  return item
                })}
              />
            </div>
          )}
          <Modal
            open={active}
            title={'Are You Sure ?'}
            content={'click agree to remove the first item of the array on the left'}
            onClose={reset}
            onSubmit={decorate(
              () => onChangeState(value.slice(1, value.length))
            )}
          />
        </div>
      )}
    </Activator>
  );
};

export default withStateProvider(comments)(ActivatorWithState);
