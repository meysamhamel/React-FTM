import React, { Component } from 'react';
import { Avatar, Card, Chip } from 'material-ui';
import TimerIcon from '@material-ui/icons/Timer';
import './RecipeInfo.css';


const styles = {
  chip: {
    margin: 4,
  },
  wrapper: {
    display: 'flex',
    flexWrap: 'wrap',
  },
};

function handleClick() {
  alert('Possibly more information about this chip?');
}


/**
 * This is recipe author, tags, difficulty, cook time...
 */
class RecipeInfo extends Component {

  constructor(props) {
    super(props);
    this.state = {
      authorImage: null,
      authorName: null,
      cookTime: null,
      prepTime: null,
      difficulty: null,
      tags: null,
    };
  }

  render() {
    return (
      <Card className="recipeInfo">
        <div className="recipeAuthor">
          <Avatar src={this.props.authorImage} />
          <span className="authorName">{this.props.authorName}</span>
          <span className="time"><TimerIcon /> {this.props.cookTime + this.props.prepTime} mins</span>
          <span className="difficulty">Difficulty: {this.props.difficulty}</span>
        </div>
        <div className="tags">
          <div style={styles.wrapper}>
            {
              this.props.tags.map((name, index) => {
                return <Chip key={index} onClick={handleClick} style={styles.chip} className="chip" label={name} />;
              })
            }
          </div>
        </div>
      </Card>
    );
  }
}

export default RecipeInfo;
