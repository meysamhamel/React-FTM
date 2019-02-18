import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  withStyles,
} from '@material-ui/core';

const styles = theme => ({});
const initialState = {
  open: false,
  isEditing: false,
  includes: [],
  excludes: [],
};

class FilterDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleCancel = () => {
    this.setState({
      open: false,
      includes: [],
      excludes: [],
      isEditing: false,
    });
  };

  handleSave = () => {
    const cleanIncludes = [];
    this.state.includes.forEach((element) => {
      cleanIncludes.push(element.trim());
    });
    const cleanExcludes = [];
    this.state.excludes.forEach((element) => {
      cleanExcludes.push(element.trim());
    });
    this.props.handleIngredientsFilter(cleanIncludes, cleanExcludes);

    this.setState({
      includes: [], excludes: [], open: false, isEditing: false,
    });
  };

  handleOnChangeIncludes = (event) => {
    const trimmedIncludes = event.target.value.trim();
    this.setState((prevState, props) => ({
      includes: trimmedIncludes.split(','),
      isEditing: true,
    }));
  };

  handleOnChangeExcludes = (event) => {
    const trimmedExcludes = event.target.value.trim();
    this.setState((prevState, props) => ({
      excludes: trimmedExcludes.split(','),
      isEditing: true,
    }));
  };

  render() {
    return (
      <div style={{ width: '100%', flex: '1' }}>
        <Button onClick={this.handleClickOpen} color="primary">
          Ingredients
        </Button>
        <Dialog
          open={this.state.open}
          onClose={this.handleCancel}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Include/Exclude Ingredients</DialogTitle>
          <DialogContent>
            <DialogContentText>Separate ingredients by a single comma.</DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="include"
              label="Include"
              fullWidth
              onChange={event => this.handleOnChangeIncludes(event)}
            />
            <TextField
              margin="dense"
              id="exclude"
              label="Exclude"
              fullWidth
              onChange={event => this.handleOnChangeExcludes(event)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleCancel} color="primary">
              Cancel
            </Button>
            <Button onClick={this.handleSave} color="primary">
              Add
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}
FilterDialog.propTypes = {
  handleIngredientsFilter: PropTypes.func.isRequired,
};

export default withStyles(styles)(FilterDialog);
