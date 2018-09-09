import React from 'react';
import { storiesOf } from '@storybook/react';
import {
  select,
  boolean,
  text,
  button,
  object
} from '@storybook/addon-knobs/react';

import SimpleCaller from '../test/SimpleCaller'
import CallerWithActivator from '../test/CallerWithActivator'

storiesOf('Caller', module)
  .add('Simple Caller', () => (
    <SimpleCaller
      startCallerWhenMount={boolean('startCallerWhenMount', false)}
    />
  ))
  .add('Caller With Activator', () => (
    <CallerWithActivator />
  ))
