import React from 'react';
import {
  compose,
  withStateHandlers
} from 'recompose';
import ReactJson from 'react-json-view'

// COMPONENTS
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

const JsonViewer = compose(
  withStateHandlers(
    ({ value }) => ({ value }),
    {
      setState: () => (value) => ({ value })
    }
  )
)(
  ({
    value,
    children,
    setState
  }) => (
    <Grid container justify={'center'}>
      <Grid item xs={7} style={{ paddingLeft: 20, height: 500 }}>
        <Typography variant={'title'} component={'h1'} color={'primary'} gutterBottom>Current State</Typography>
        <ReactJson src={{ value }} />
      </Grid>
      <Grid item xs={5} style={{ paddingRight: 20 }}>
        {children({ displayJson: setState })}
      </Grid>
    </Grid>
  )
);

JsonViewer.propTypes = {};
JsonViewer.defaultProps = {};

export default JsonViewer;
