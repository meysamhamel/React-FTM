import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  MenuList,
  MenuItem,
  ClickAwayListener,
  Popper,
  Grow,
  Paper,
  Typography,
} from '@material-ui/core';
import Slider from '@material-ui/lab/Slider';
import { withStyles } from 'material-ui/styles';

const styles = {
  root: {
    width: 300,
  },
  slider: {
    padding: '22px 0px',
  },
};

class FilterButton extends React.Component {
  state = {
    anchorEl: null,
    sliderValue: 10,
  };

  handleChange = (event, checked) => {
    this.setState({ active: checked });
  };

  handleMenu = (event) => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = (item, event) => {
    if (!(item instanceof MouseEvent)) {
    }
    this.setState({ anchorEl: null });
  };

  handleNewChip = (title, item) => {
    if (!(item instanceof MouseEvent)) {
      this.props.handleAddFilterChip(title, item);
    }
    this.setState({ anchorEl: null });
  };

  handleSliderChange = (event, value) => {
    this.setState({ sliderValue: value });
  };

  render() {
    const { active, anchorEl, sliderValue } = this.state;
    const open = Boolean(anchorEl);
    const { title, styles } = this.props;
    const listItems = this.props.items.map((item, index) => (
      <MenuItem key={index} onClick={event => this.handleNewChip(title, item)}>
        {item}
      </MenuItem>
    ));
    return (
      <div style={{ width: '100%', flex: '1' }}>
        <Button
          buttonRef={(node) => {
            this.anchorEl = node;
          }}
          style={{ justifySelf: 'center' }}
          aria-owns={open ? 'filter-list-grow' : null}
          aria-haspopup="true"
          onClick={this.handleMenu}
          color="primary"
        >
          {title}
        </Button>
        <Popper open={open} anchorEl={this.anchorEl} transition disablePortal>
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              id="filter-list-grow"
              style={{
                transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom',
              }}
            >
              <Paper style={{ width: '100%', height: '100%' }}>
                <ClickAwayListener onClickAway={this.handleClose}>
                  <Typography id="label">Slider label</Typography>
                  <Slider
                    style={{ width: 300, padding: '25px' }}
                    value={sliderValue}
                    aria-labelledby="label"
                    onChange={this.handleSliderChange}
                  />
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </div>
    );
  }
}

FilterButton.propTypes = {
  title: PropTypes.string.isRequired,
  items: PropTypes.array.isRequired,
};

export default withStyles(styles)(FilterButton);
