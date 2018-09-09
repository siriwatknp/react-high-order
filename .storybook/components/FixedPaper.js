import React from 'react';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper'

const FixedPaper = ({ children }) => {
  return (
    <Paper
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        zIndex: 100000,
        padding: 12,
        minWidth: 300,
      }}
    >
      {children}
    </Paper>
  );
};

FixedPaper.propTypes = {};
FixedPaper.defaultProps = {};

export default FixedPaper;
