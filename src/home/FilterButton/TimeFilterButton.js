import React from 'react';
import PropTypes from 'prop-types';
import { Button, Popper, Grow, Paper, Typography } from '@material-ui/core';
import { Slider, ToggleButtonGroup, ToggleButton } from '@material-ui/lab';
import { HourglassEmpty, HourglassFull } from '@material-ui/icons';

class TimeFilterButton extends React.Component {
  state = {
    anchorEl: null,
    open: false,
    sliderValue: 15,
    compareSign: 'le'
  };

  handleVisivility = (event, checked) => {
    this.setState({ active: checked });
  };

  handleMenu = event => {
    const { currentTarget } = event;
    this.setState(state => ({
      anchorEl: currentTarget,
      open: !state.open
    }));
  };

  handleClose = (item, event) => {
    if (!(item instanceof MouseEvent)) {
    }
    this.setState(state => ({ open: false }));
  };

  handleCancel = () => {
    this.setState(state => ({ open: false }));
  };

  handleSliderChange = (event, value) => {
    this.setState({ sliderValue: value });
  };

  handleSignChange = (event, value) => {
    if (value !== null) {
      this.setState({ compareSign: value });
    }
  };

  handleSave = () => {
    let sign = '';
    switch (this.state.compareSign) {
      case 'le':
        sign = '<= ';
        break;
      case 'ge':
        sign = '>= ';
        break;
      default:
        sign = '== ';
    }
    this.props.handleAddFilterChip(
      this.props.title,
      sign.concat(this.state.sliderValue).concat(' min')
    );
    this.setState({ open: false });
  };

  render() {
    const { sliderValue, compareSign, open } = this.state;
    const { title } = this.props;
    return (
      <div style={{ width: '100%', flex: '1' }}>
        <Button
          buttonRef={node => {
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
        <Popper
          open={open}
          anchorEl={this.anchorEl}
          placement={'bottom-start'}
          transition
          disablePortal
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              id="filter-list-grow"
              style={{
                transformOrigin:
                  placement === 'bottom-start' ? 'left top' : 'left bottom'
              }}
            >
              <Paper style={{ width: '100%', height: '100%' }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  <ToggleButtonGroup
                    style={{ marginTop: 25 }}
                    value={compareSign}
                    exclusive
                    onChange={this.handleSignChange}
                  >
                    <ToggleButton value="eq">&equiv;</ToggleButton>
                    <ToggleButton value="le">&le;</ToggleButton>
                    <ToggleButton value="ge">&ge;</ToggleButton>
                  </ToggleButtonGroup>
                  <Typography
                    id="label"
                    align="center"
                    style={{
                      paddingTop: 25,
                      paddingLeft: 25,
                      paddingRight: 25
                    }}
                  >
                    {sliderValue} minutes
                  </Typography>
                </div>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  <HourglassEmpty style={{ margin: 5 }} color="primary" />
                  <Slider
                    min={10}
                    max={120}
                    step={5}
                    style={{
                      width: 300,
                      paddingTop: 25,
                      paddingBottom: 25,
                      paddingLeft: 10,
                      paddingRight: 10
                    }}
                    value={sliderValue}
                    aria-labelledby="label"
                    onChange={this.handleSliderChange}
                  />
                  <HourglassFull style={{ margin: 5 }} color="primary" />
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    alignItems: 'center'
                  }}
                >
                  <Button
                    onClick={this.handleCancel}
                    color="primary"
                    style={{ margin: 5 }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={this.handleSave}
                    color="primary"
                    style={{ margin: 5 }}
                  >
                    Add
                  </Button>
                </div>
              </Paper>
            </Grow>
          )}
        </Popper>
      </div>
    );
  }
}

TimeFilterButton.propTypes = {
  title: PropTypes.string.isRequired
};

export default TimeFilterButton;
