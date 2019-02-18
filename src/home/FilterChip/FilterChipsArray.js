import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, Chip } from '@material-ui/core';

const styles = theme => ({
  root: {
    padding: theme.spacing.unit / 2,
  },
  chip: {
    margin: theme.spacing.unit / 2,
  },
});

class FilterChipsArray extends React.Component {
  state = {
    chipData: [],
  };

  handleAddFilterChip = (chipTitle, chipLabel) => {
    const newChipData = this.state.chipData.slice();
    if (newChipData.length === 0) {
      newChipData.push({ key: 0, title: chipTitle, label: chipLabel });
    } else {
      let newAdd = true;
      newChipData.forEach((element) => {
        if (chipTitle === element.title) {
          if (chipLabel === element.label) {
            newAdd = false;
          }
        }
      });
      if (newAdd) {
        newChipData.push({ key: 0, title: chipTitle, label: chipLabel });
      }
    }
    const updatedChipData = [];
    newChipData.forEach((chip, index) => {
      updatedChipData.push({ key: index, title: chip.title, label: chip.label });
    });
    if (updatedChipData.length > 0) {
      this.props.handleHasFilterChips(true);
    }
    this.setState((prevState, props) => ({
      chipData: updatedChipData,
    }));
  };

  handleAddIngredientChips = (includes, excludes) => {
    const newChipData = this.state.chipData.slice();
    const updatedChipData = [];

    const newIncludes = [];
    const newExcludes = [];
    includes.forEach((element) => {
      if (newChipData.filter(potential => potential.label === element).length === 0) {
        if (newIncludes.filter(potential => potential.label === element).length === 0) {
          newIncludes.push({ key: 0, title: 'Include', label: element });
        }
      }
    });
    excludes.forEach((element) => {
      if (newChipData.filter(potential => potential.label === element).length === 0) {
        if (newExcludes.filter(potential => potential.label === element).length === 0) {
          newExcludes.push({ key: 0, title: 'Exclude', label: element });
        }
      }
    });
    const newData = newIncludes.concat(newExcludes).concat(newChipData);
    newData.forEach((chip, index) => {
      updatedChipData.push({ key: index, title: chip.title, label: chip.label });
    });
    if (updatedChipData.length > 0) {
      this.props.handleHasFilterChips(true);
    }
    console.log(updatedChipData);
    this.setState((prevState, props) => ({
      chipData: updatedChipData,
    }));
  };

  handleDelete = data => () => {
    this.setState((state, props) => {
      const chipData = [...state.chipData];
      const chipToDelete = chipData.indexOf(data);
      chipData.splice(chipToDelete, 1);
      if (chipData.length === 0) {
        this.props.handleHasFilterChips(false);
      }
      this.props.handleDeleteFilterChips(data);
      return { chipData };
    });
  };

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        {this.state.chipData.map((data, index) => {
          return (
            <Chip
              key={data.key}
              label={`${data.title}: ${data.label}`}
              onDelete={this.handleDelete(data)}
              className={classes.chip}
            />
          );
        })}
      </div>
    );
  }
}

FilterChipsArray.propTypes = {
  classes: PropTypes.object.isRequired,
  handleHasFilterChips: PropTypes.func.isRequired,
  handleDeleteFilterChips: PropTypes.func.isRequired,
};

export default withStyles(styles)(FilterChipsArray);
