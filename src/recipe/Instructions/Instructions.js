import React, { Component } from 'react';
import {
  Card,
  Grid,
  List,
  ListItem,
  Checkbox,
  Typography,
  FormControlLabel
} from '@material-ui/core';
import './Instructions.css';

class RecipeInstructions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: null
    };
  }

  render() {
    console.log(this.props.images);
    function InstructionImage(props) {
      if (props.images !== undefined && props.images.length > 1) {
        return (
          <img
            className="listImage"
            alt="user"
            title="Edit Profile Picture"
            src={
              props.images[props.index] !== undefined
                ? props.images[props.index]
                : 'https://i.imgur.com/Uy1Ln6x.jpg'
            }
          />
        );
      }
      return null;
    }
    return (
      <Card>
        <Typography className="instructions-title">
          <b>Directions</b>
          <i className="material-icons">library_books</i>{' '}
        </Typography>
        <Grid item>
          <List className="instructions-list">
            {this.props.value.map((name, index) => {
              return (
                <ListItem key={index}>
                  <div className="listRoot">
                    <InstructionImage
                      images={this.props.images}
                      index={index}
                    />
                    <FormControlLabel control={<Checkbox />} label={name} />
                  </div>
                </ListItem>
              );
            })}
          </List>
        </Grid>
      </Card>
    );
  }
}

export default RecipeInstructions;
