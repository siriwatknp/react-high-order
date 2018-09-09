import React from 'react';
import PropTypes from 'prop-types';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';

class Modal extends React.Component {
  render() {
    const { open, title, content, onClose, onSubmit } = this.props;
    return (
      <Dialog
        open={open}
        onClose={onClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{title || 'Use Google\'s location service?'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {content || (
              'Let Google help apps determine location. This means sending anonymous location data to\n' +
              'Google, even when no apps are running.'
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          {onClose && (
            <Button onClick={onClose} color="primary">
              Disagree
            </Button>
          )}
          {onSubmit && (
            <Button onClick={onSubmit} color="primary" autoFocus>
              Agree
            </Button>
          )}
        </DialogActions>
      </Dialog>
    );
  }
}

Modal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func
};

export default Modal;
