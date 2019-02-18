import React from 'react';
import PropTypes from 'prop-types';
import { Button, Typography, Paper } from '@material-ui/core';
import './FilterTab.css';

const FilterTab = ({ filter, color }) => (
  <Paper>
    <div className="filter-root">
      <Button variant="contained" color="primary" className="filter-button">
        <Typography className="filter-title" variant="button">
          {filter}
        </Typography>
      </Button>
    </div>
  </Paper>
);

FilterTab.propTypes = {
  filter: PropTypes.string,
  color: PropTypes.string
};

export default FilterTab;
