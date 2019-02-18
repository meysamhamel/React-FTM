import React, { Component } from 'react';
import { Card, Grid, List, ListItem, Checkbox, Typography } from '@material-ui/core';
import './RecipeInstructions.css';

class RecipeInstructions extends Component {

  constructor(props) {
    super(props);
    this.state = {
      value: null,
    };
  }

  render() {
    return (
      <Card>
        <Typography className="instructions-title"> Directions </Typography>
        <Grid item>
          <List className="instructions-list">
            {
              this.props.value.map((name, index) => {
                return <ListItem key={index}><Checkbox />{name}</ListItem>;
              })
            }
          </List>
        </Grid>
      </Card>
    );
  }
}

export default RecipeInstructions;
