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

storiesOf('Caller', module)
  .add('Simple Caller', () => (
    <SimpleCaller
      startCallerWhenMount={boolean('startCallerWhenMount', false)}
    />
  ))
