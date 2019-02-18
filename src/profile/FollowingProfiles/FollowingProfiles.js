import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Card, CardHeader, CardMedia, IconButton } from '@material-ui/core';
import { Close } from '@material-ui/icons';
import { Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import './FollowingProfiles.css';

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
    paddingTop: '56.25%' // 16:9
  },
  actions: {
    display: 'flex'
  },
  avatar: {
    margin: 5,
    width: 45,
    height: 45
  },
  title: {
    marginBottom: 5,
    fontSize: 12
  },
  pos: {
    marginBottom: 12
  }
};
class FollowingProfiles extends React.Component {
  state = { expanded: false };

  handleExpandClick = () => {
    this.setState(state => ({ expanded: !state.expanded }));
  };

  truncateString = des => {
    console.log(des);
  };

  render() {
    let { classes, name, r_id, images } = this.props;

    if (images === null || images === '') {
      images = 'http://i65.tinypic.com/2rnvc7k.png';
    }

    return (
      <Route
        render={({ history }) => (
          <Card
            className={classes.card + ' card-container'}
            onClick={() => {
              history.push(`/profile/${r_id}`);
            }}
          >
            <CardHeader
              title={name}
              action={
                <IconButton
                  onClick={e => {
                    e.stopPropagation();
                    this.props.onDelete();
                  }}
                >
                  <Close />
                </IconButton>
              }
            />
            <CardMedia className={classes.media} image={images} />
          </Card>
        )}
      />
    );
  }
}

FollowingProfiles.propTypes = {
  classes: PropTypes.object.isRequired,
  name: PropTypes.any.isRequired,
  r_id: PropTypes.any.isRequired,
  images: PropTypes.any.isRequired
};

export default withStyles(styles)(FollowingProfiles);
