import React from 'react';
import { compose, withStateHandlers } from 'recompose'
import ReactJson from 'react-json-view'

// COMPONENTS
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'

export default (initialState) => WrappedComponent => compose(
  withStateHandlers(({ initialState: initialStateFromProps }) => ({
    value: initialStateFromProps || initialState
  }), {
    onChangeState: () => (state) => ({ value: state}),
    onChangeField: state => (key, value) => ({...state, [key]: value }),
  })
)(
  ({
    value,
    onChangeState,
    onChangeField,
    ...props,
  }) => {
    return (
      <Grid container justify={'center'}>
        <Grid item xs={7} style={{ paddingLeft: 20, height: 500 }}>
          <Typography variant={'title'} component={'h1'} color={'primary'} gutterBottom>Current State</Typography>
          <ReactJson src={{ value }} />
        </Grid>
        <Grid item xs={5}>
          <WrappedComponent
            value={value}
            onChangeState={onChangeState}
            onChange={onChangeField}
            {...props}
          />
        </Grid>
      </Grid>
    )
  }
)
