import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles, Button, Snackbar, IconButton } from '@material-ui/core';
import { Close } from '@material-ui/icons';

const styles = theme => ({
  close: {
    width: theme.spacing.unit * 4,
    height: theme.spacing.unit * 4,
  },
});

class CustomSnackbar extends React.Component {
  state = {
    open: false,
  };

  handleClick = () => {
    this.setState({ open: true });
  };

  handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    this.setState({ open: false });
  };

  render() {
    const { classes } = this.props;
    return <div>test</div>;
  }
}

CustomSnackbar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CustomSnackbar);
