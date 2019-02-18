import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  MenuList,
  MenuItem,
  Popper,
  Grow,
  Paper,
  ListItemIcon,
  ListItemText,
} from '@material-ui/core';
import { Star, StarBorder } from '@material-ui/icons';

class LevelsFilterButton extends React.Component {
  state = {
    anchorEl: null,
    open: false,
    numOfStars: 0,
  };

  handleChange = (_, checked) => {
    this.setState({ active: checked });
  };

  handleMenu = (event) => {
    const { currentTarget } = event;
    this.setState(state => ({
      anchorEl: currentTarget,
      open: !state.open,
    }));
  };

  handleOnClick = (number, event) => {
    this.props.handleAddFilterChip(this.props.title, String(number));
    this.setState(() => ({ open: false }));
  };

  render() {
    const { open } = this.state;
    const { title } = this.props;
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
                transformOrigin: placement === 'bottom-start' ? 'left top' : 'left bottom',
              }}
            >
              <Paper style={{ width: '100%', height: '100%' }}>
                <MenuList>
                  <MenuItem
                    id="fiveStar"
                    style={{ padding: 20 }}
                    onClick={() => this.handleOnClick(5)}
                  >
                    <ListItemIcon>
                      <Star style={{ margin: 2 }} />
                    </ListItemIcon>
                    <ListItemIcon>
                      <Star style={{ margin: 2 }} />
                    </ListItemIcon>
                    <ListItemIcon>
                      <Star style={{ margin: 2 }} />
                    </ListItemIcon>
                    <ListItemIcon>
                      <Star style={{ margin: 2 }} />
                    </ListItemIcon>
                    <ListItemIcon>
                      <Star style={{ margin: 2 }} />
                    </ListItemIcon>
                    <ListItemText inset primary="Only" />
                  </MenuItem>
                  <MenuItem
                    id="fourStar"
                    style={{ padding: 20 }}
                    onClick={() => this.handleOnClick(4)}
                  >
                    <ListItemIcon>
                      <Star style={{ margin: 2 }} />
                    </ListItemIcon>
                    <ListItemIcon>
                      <Star style={{ margin: 2 }} />
                    </ListItemIcon>
                    <ListItemIcon>
                      <Star style={{ margin: 2 }} />
                    </ListItemIcon>
                    <ListItemIcon>
                      <Star style={{ margin: 2 }} />
                    </ListItemIcon>
                    <ListItemIcon>
                      <StarBorder style={{ margin: 2 }} />
                    </ListItemIcon>
                    <ListItemText inset primary="&amp; Up" />
                  </MenuItem>
                  <MenuItem
                    id="threeStar"
                    style={{ padding: 20 }}
                    onClick={() => this.handleOnClick(3)}
                  >
                    <ListItemIcon>
                      <Star style={{ margin: 2 }} />
                    </ListItemIcon>
                    <ListItemIcon>
                      <Star style={{ margin: 2 }} />
                    </ListItemIcon>
                    <ListItemIcon>
                      <Star style={{ margin: 2 }} />
                    </ListItemIcon>
                    <ListItemIcon>
                      <StarBorder style={{ margin: 2 }} />
                    </ListItemIcon>
                    <ListItemIcon>
                      <StarBorder style={{ margin: 2 }} />
                    </ListItemIcon>
                    <ListItemText inset primary="&amp; Up" />
                  </MenuItem>
                  <MenuItem
                    id="twoStar"
                    style={{ padding: 20 }}
                    onClick={() => this.handleOnClick(2)}
                  >
                    <ListItemIcon>
                      <Star style={{ margin: 2 }} />
                    </ListItemIcon>
                    <ListItemIcon>
                      <Star style={{ margin: 2 }} />
                    </ListItemIcon>
                    <ListItemIcon>
                      <StarBorder style={{ margin: 2 }} />
                    </ListItemIcon>
                    <ListItemIcon>
                      <StarBorder style={{ margin: 2 }} />
                    </ListItemIcon>
                    <ListItemIcon>
                      <StarBorder style={{ margin: 2 }} />
                    </ListItemIcon>
                    <ListItemText inset primary="&amp; Up" />
                  </MenuItem>

                  <MenuItem
                    id="oneStar"
                    style={{ padding: 20 }}
                    onClick={() => this.handleOnClick(1)}
                  >
                    <ListItemIcon>
                      <Star style={{ margin: 2 }} />
                    </ListItemIcon>
                    <ListItemIcon>
                      <StarBorder style={{ margin: 2 }} />
                    </ListItemIcon>
                    <ListItemIcon>
                      <StarBorder style={{ margin: 2 }} />
                    </ListItemIcon>
                    <ListItemIcon>
                      <StarBorder style={{ margin: 2 }} />
                    </ListItemIcon>
                    <ListItemIcon>
                      <StarBorder style={{ margin: 2 }} />
                    </ListItemIcon>
                    <ListItemText inset primary="&amp; Up" />
                  </MenuItem>
                  <MenuItem
                    id="zeroStar"
                    style={{ padding: 20 }}
                    onClick={() => this.handleOnClick(0)}
                  >
                    <ListItemIcon>
                      <StarBorder style={{ margin: 2 }} />
                    </ListItemIcon>
                    <ListItemIcon>
                      <StarBorder style={{ margin: 2 }} />
                    </ListItemIcon>
                    <ListItemIcon>
                      <StarBorder style={{ margin: 2 }} />
                    </ListItemIcon>
                    <ListItemIcon>
                      <StarBorder style={{ margin: 2 }} />
                    </ListItemIcon>
                    <ListItemIcon>
                      <StarBorder style={{ margin: 2 }} />
                    </ListItemIcon>
                    <ListItemText inset primary="&amp; Up" />
                  </MenuItem>
                </MenuList>
              </Paper>
            </Grow>
          )}
        </Popper>
      </div>
    );
  }
}

LevelsFilterButton.propTypes = {
  title: PropTypes.string.isRequired,
};

export default LevelsFilterButton;
