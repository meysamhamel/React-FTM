import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import {
  Card,
  CardContent,
  Typography,
  Avatar,
  CardHeader,
  CardMedia,
  IconButton
} from '@material-ui/core';
import { Close } from '@material-ui/icons';
import { Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import './SearchResult.css';

const styles = {
  card: {
    marginTop: 20,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
    cursor: 'pointer'
  },
  media: {
    height: 0,
    paddingTop: '75%' // 16:9
  },
  actions: {
    display: 'flex'
  },
  avatar: {
    width: 30,
    height: 30
  },
  title: {
    marginBottom: 5,
    fontSize: 12
  },
  pos: {
    marginBottom: 12
  }
};
class SearchResult extends React.Component {
  state = { expanded: false };

  handleExpandClick = () => {
    this.setState(state => ({ expanded: !state.expanded }));
  };

  truncateString = des => {
    console.log(des);
  };

  render() {
    const { classes, name, r_id, description, images, rating } = this.props;

    return (
      <Route
        render={({ history }) => (
          <Card
            className={classes.card}
            onClick={() => {
              history.push(`/recipe/${r_id}`);
            }}
          >
            <CardMedia className={classes.media} image={images[0]} />
            <CardHeader
              className="recipe-header"
              avatar={
                <Avatar
                  alt={name}
                  className={classes.avatar}
                  src="http://i65.tinypic.com/2rnvc7k.png"
                />
              }
              action={
                this.props.onDelete ? (
                  <IconButton
                    onClick={e => {
                      e.stopPropagation();
                      this.props.onDelete();
                    }}
                  >
                    <Close />
                  </IconButton>
                ) : null
              }
              title={name}
            />
            <CardContent style={{ padding: '5px' }}>
              <Typography className="recipe-description" variant="caption">
                {description}
              </Typography>
            </CardContent>
          </Card>
        )}
      />
    );
  }
}

SearchResult.propTypes = {
  classes: PropTypes.object.isRequired,
  name: PropTypes.any.isRequired,
  r_id: PropTypes.any.isRequired,
  description: PropTypes.any.isRequired,
  images: PropTypes.any.isRequired
};

export default withStyles(styles)(SearchResult);
