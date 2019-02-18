import React, { Component } from 'react';
import { Card, CardMedia } from 'material-ui';
import './RecipePicture.css';

class RecipePicture extends Component {

  constructor(props) {
    super(props);
    this.state = {
      imageURL: null,
      title: null,
    };
  }

  render() {

    return (
      <div className="fullSize">
        <Card className="recipe-pic">
          <CardMedia className="recipe-picture" image={this.props.imageURL} alt="hello" />
          <div className="picture-title">
            
          </div>
        </Card>
      </div>
    );
  }
}

export default RecipePicture;
