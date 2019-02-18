import React, { Component } from 'react';
import { Card, CardMedia } from '@material-ui/core';
import StarIcon from '@material-ui/icons/Star';
import './Picture.css';

class RecipePicture extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageURL: null,
      title: null,
      stars: null,
    };
  }

  render() {
    const tmp = [];
    for (let i = 0; i < this.props.stars; i++) {
      tmp.push(i);
    }
    const staricons = tmp.map(function (i) {
      return (
        <StarIcon key={i} />
      );
    });

    return (
      <div className="fullSize">
        <Card className="recipe-pic">
          <CardMedia className="recipe-picture" image={this.props.imageURL} alt="hello" />
          <div className="picture-title">
            <span>{this.props.title}</span>
            <span>{staricons}</span>
          </div>
        </Card>
      </div>
    );
  }
}

export default RecipePicture;
