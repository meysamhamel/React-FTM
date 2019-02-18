import React, { Fragment } from 'react';
import { Typography, AppBar, Toolbar, Button, withStyles, Avatar } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { compose, withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import withLocalData from '../../withLocalData';

const jwt = require('jsonwebtoken');

const styles = {
  root: {
    flexGrow: 1,
  },
  flex: {
    flex: 1,
  },
  menuButton: {
    marginRight: 20,
  },
  list: {
    width: 250,
  },
  fullList: {
    width: 'auto',
  },
};

class HomeAppBar extends React.Component {
  state = { user_image: null };

  async getDataFromAPI() {
    const user = await this.fetchUser();
    console.log('GETDATAFROMAPI: ', user);
    this.setState({ user_image: user.profilePicture });
  }

  componentWillMount() {
    this.getDataFromAPI();
  }
  componentDidUpdate(prevProps) {
    if (this.props.token !== prevProps.token || this.props.client !== prevProps.client) {
      this.getDataFromAPI();
    }
  }

  fetchUser = async () => {
    try {
      const { client, token } = this.props;
      const decoded = jwt.decode(token);
      const result = client
        .query({
          query: gql`{           
            userById(
              id: "${decoded.id}"
            ) {
              profilePicture
            }
          }
        `,
          fetchPolicy: 'network-only',
        })
        .then((result) => {
          return result.data.userById;
        });
      return result;
    } catch (err) {
      return {};
    }
  };

  render() {
    const { classes, token } = this.props;
    return (
      <div className={classes.root}>
        <AppBar id="main-app-bar" position="fixed">
          <Toolbar>
            <Typography
              variant="h6"
              color="inherit"
              className={classes.flex}
              style={{ textDecoration: 'none' }}
              component={Link}
              to="/"
            >
              FoodtoMake
            </Typography>
            {token ? (
              <Fragment>
                {/* {this.getDataFromAPI && ( */}
                <Avatar
                  aria-label="Result"
                  className={classes.avatar}
                  src={
                    this.state.user_image !== null
                      ? this.state.user_image
                      : 'http://i65.tinypic.com/2rnvc7k.png'
                  }
                  component={Link}
                  to="/profile"
                />
                <Button color="inherit" component={Link} to="/signout">
                  Sign Out
                </Button>
              </Fragment>
            ) : (
              <Fragment>
                <Button color="inherit" component={Link} to="/signup">
                  Sign Up
                </Button>
                <Button color="inherit" component={Link} to="/login">
                  Login
                </Button>
              </Fragment>
            )}
            <Button color="inherit" component={Link} to="/helpPage">
              Help
            </Button>
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

export default compose(
  withLocalData,
  withApollo,
  withStyles(styles),
)(HomeAppBar);
