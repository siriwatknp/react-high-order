import React from 'react'
import { configure, addDecorator } from '@storybook/react';
import { setDefaults } from '@storybook/addon-info';
import { withKnobs } from '@storybook/addon-knobs';
import withBackgroundColors from './decorators/BackgroundColors'

// Sets the info addon's options.
setDefaults({
  header: false
});

const req = require.context('./story', true, /\.story\.js$/)

const withThemeProvider = storyFn => (
  <ThemeProvider theme={theme}>{storyFn()}</ThemeProvider>
);

const withStoryStyles = storyFn => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
      }}
    >
      {storyFn()}
    </div>
  );
};


const loadStories = () => {
  addDecorator(withKnobs);
  addDecorator(withStoryStyles);
  addDecorator(withBackgroundColors([
    { value: '#ffffff', defaultColor: true },
    { value: '#000000' },
    { value: '#a5a5a5' },
  ]));
  req.keys().forEach(filename => req(filename));
};

configure(loadStories, module);