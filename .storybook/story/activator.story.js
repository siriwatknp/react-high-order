import React from 'react';
import { storiesOf } from '@storybook/react';
import {
  select,
  boolean,
  text,
  button,
  object
} from '@storybook/addon-knobs/react';

import SimpleActivator from '../test/SimpleActivator'
import ActivatorWithState from '../test/ActivatorWithState'

storiesOf('Activator', module)
.add('Simple Activator', () => (
  <SimpleActivator
    resetAfterAction={boolean('reset after action', true)}
  />
))
.add('Activator with State', () => (
  <ActivatorWithState
    resetAfterAction={boolean('reset after action', true)}
  />
))