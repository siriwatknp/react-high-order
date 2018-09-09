import React from 'react';

// COMPONENTS
import Button from '@material-ui/core/Button';
import Modal from '../components/Modal'

import { Activator } from '../../src/index'

const SimpleActivator = (props) => {
  return (
    <Activator {...props}>
      {({
        decorate,
        activate,
        active,
        params,
        reset,
      }) => (
        <div>
          <Button variant={'contained'} onClick={activate}>
            Trigger Modal Before Action
          </Button>
          <Modal
            open={active}
            onClose={reset}
            onSubmit={decorate(() => alert('Action is called!'))}
          />
        </div>
      )}
    </Activator>
  );
};

export default SimpleActivator;
