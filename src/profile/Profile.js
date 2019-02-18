import React, { Component } from 'react';
import {
  Grid,
  FormControl,
  Input,
  InputLabel,
  InputAdornment,
  Icon,
  Button,
  Fab
} from '@material-ui/core';
import { Create } from '@material-ui/icons';
import { Spring, Trail, animated } from 'react-spring';
import gql from 'graphql-tag';
import { compose, withApollo } from 'react-apollo';
import { Route } from 'react-router-dom';
import ProfilePicture from './ProfilePicture/ProfilePicture';
import SearchResult from '../home/SearchResult/SearchResult';
import Social from './Social/Social';
import Loading from '../loading/Loading';
import FollowingProfile from './FollowingProfiles/FollowingProfiles';
import './Profile.css';
import withLocalData from '../withLocalData';

const jwt = require('jsonwebtoken');
const jsPDF = require('jspdf');
require('jspdf-autotable');

const styles = {
  spacing: 24,
  sizes: {
    xs: {
      picture: 12,
      social: 12,
      recipes: 12
    },
    sm: {
      picture: 8,
      social: 8,
      recipes: 8
    }
  },
  gridList: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    alignItems: 'flex-start',
    overflow: 'hidden'
  }
};

const savedString = 'saved';
const ownedString = 'owned';
const followingString = 'following';
const madeThisString = 'madethis';

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user_image: 'http://i65.tinypic.com/2rnvc7k.png',
      username: null,
      user_id: null,
      owned_recipes: [],
      saved_recipes: [],
      made_recipes: [],
      owned_recipes_searching: [],
      saved_recipes_searching: [],
      made_recipes_searching: [],
      owned_recipes_length: null,
      saved_recipes_length: null,
      made_recipes_length: null,
      following: [],
      followers: [],
      following_length: null,
      followers_length: null,
      query: '',
      currently_viewing: 'saved', // ********** saved, owned, following, or madethis *************
      searchSavedOrOwned: true, // search saved by default, so false means search owned
      following: false
    };

    this.showResults = this.showResults.bind(this);
    this.followUser = this.followUser.bind(this);
    this.exportToPdf = this.exportToPdf.bind(this);
    this.isMyProfile = this.isMyProfile.bind(this);
    // this.getDataFromAPI();
  }

  showResults(arg) {
    console.log('SHOW RESULTS: ', arg);
    this.setState(
      {
        currently_viewing: arg
      },
      () => this.printClicked()
    );
  }
  printClicked() {
    console.log('clicked: ', this.state.currently_viewing);
    if (this.state.currently_viewing === savedString) {
      this.setState({
        searchSavedOrOwned: true,
      });
    } else if (this.state.currently_viewing === ownedString) {
      this.setState({
        searchSavedOrOwned: false,
      });
    }
  }

  componentWillMount() {
    this.getDataFromAPI();
    console.log('in the component will mount now');
  }

  componentWillReceiveProps(newProps) {
    if (newProps.match.params.username !== this.props.match.params.username) {
      console.log('NEW PROPS');
      this.forceUpdate();
      window.location.reload();
    }
    console.log('in receive props');
  }

  handleQueryChange = event => {
    this.setState({
      query: event.target.value
    });
  };

  handleMouseDown = event => {
    event.preventDefault();
  };

  handleEnterSearch = async event => {
    const { client } = this.props;
    if (event.key === 'Enter') {
      if (this.state.query === '' || this.state.query === null) {
        client
          .query({
            query: gql`{           
          userById(
            id: "${this.state.user_id}"
          ) {
            id
            username
            ownedRecipes (limit: 100) {name id description images ingredients instructions}
            savedRecipes {name id description images ingredients instructions}
            madeRecipes {name id description images ingredients instructions}
            following {id username profilePicture}
            followers {id username profilePicture}
          }
        }
      `,
            fetchPolicy: 'network-only'
          })
          .then(result => {
            console.log('empty query: ', result.data.userById);
            this.setState(
              {
                loading: true,
                owned_recipes: result.data.userById.ownedRecipes,
                saved_recipes: result.data.userById.savedRecipes,
                made_recipes: result.data.userById.madeRecipes,
                following: result.data.userById.following,
                followers: result.data.userById.followers,
                owned_recipes_searching: result.data.userById.ownedRecipes,
                saved_recipes_searching: result.data.userById.savedRecipes,
                made_recipes_searching: result.data.userById.madeRecipes
              },
              () => this.setLengths()
            );
            return result.data.userById;
          })
          .catch(err => {
            console.log('error with empty query');
            console.log(err);
          });
      } else if (this.state.searchSavedOrOwned) {
      // search trhough saved
        const { data } = await client.query({
          query: gql`
              query {
                searchSavedRecipes(userId: "${this.state.user_id}" query: "${
            this.state.query
          }") {
                  id
                  name
                  description
                  images
                }
              }`
        });
        this.setState({
          loading: true,
          saved_recipes_searching: data.searchSavedRecipes
        });
      } else if (!this.state.searchSavedOrOwned) {
      // search through owned
        const { data } = await client.query({
          query: gql`
              query {
                searchOwnedRecipes(userId: "${this.state.user_id}" query: "${
            this.state.query
          }") {
                  id
                  name
                  description
                  images
                }
              }`
        });
        this.setState({
          loading: true,
          owned_recipes_searching: data.searchOwnedRecipes
        });
      } 
    }
  };

  handleButtonSearch = async () => {
    const { client } = this.props;
    /*
    if (this.state.searchSavedOrOwned) {
      // search trhough saved
      const { data } = await client.query({
        query: gql`
          query {
            searchSavedRecipes(userId: "${this.state.user_id}" query: "${
          this.state.query
        }") {
              id
              name
              description
              images
            }
          }`
      });
      this.setState({
        loading: true,
        saved_recipes: data.searchSavedRecipes
      });
    } else {
      // search through owned
      const { data } = await client.query({
        query: gql`
          query {
            searchOwnedRecipes(userId: "${this.state.user_id}" query: "${
          this.state.query
        }") {
              id
              name
              description
              images
            }
          }`
      });
      this.setState({
        loading: true,
        owned_recipes: data.searchOwnedRecipes
      });
    }
    */
    if (this.state.query === '' || this.state.query === null) {
      client
        .query({
          query: gql`{           
        userById(
          id: "${this.state.user_id}"
        ) {
          id
          username
          ownedRecipes (limit: 100) {name id description images ingredients instructions}
          savedRecipes {name id description images ingredients instructions}
          madeRecipes {name id description images ingredients instructions}
          following {id username profilePicture}
          followers {id username profilePicture}
        }
      }
    `,
          fetchPolicy: 'network-only'
        })
        .then(result => {
          console.log('empty query: ', result.data.userById);
          this.setState(
            {
              loading: true,
              owned_recipes: result.data.userById.ownedRecipes,
              saved_recipes: result.data.userById.savedRecipes,
              made_recipes: result.data.userById.madeRecipes,
              following: result.data.userById.following,
              followers: result.data.userById.followers,
              owned_recipes_searching: result.data.userById.ownedRecipes,
              saved_recipes_searching: result.data.userById.savedRecipes,
              made_recipes_searching: result.data.userById.madeRecipes
            },
            () => this.setLengths()
          );
          return result.data.userById;
        })
        .catch(err => {
          console.log('error with empty query');
          console.log(err);
        });
    } else if (this.state.searchSavedOrOwned) {
    // search trhough saved
      const { data } = await client.query({
        query: gql`
            query {
              searchSavedRecipes(userId: "${this.state.user_id}" query: "${
          this.state.query
        }") {
                id
                name
                description
                images
              }
            }`
      });
      this.setState({
        loading: true,
        saved_recipes_searching: data.searchSavedRecipes
      });
    } else if (!this.state.searchSavedOrOwned) {
    // search through owned
      const { data } = await client.query({
        query: gql`
            query {
              searchOwnedRecipes(userId: "${this.state.user_id}" query: "${
          this.state.query
        }") {
                id
                name
                description
                images
              }
            }`
      });
      this.setState({
        loading: true,
        owned_recipes_searching: data.searchOwnedRecipes
      });
    }
  };

  exportToPdf() {
    const doc = new jsPDF('pt');
    let rec = null;
    if (this.state.currently_viewing === savedString) {
      rec = this.state.saved_recipes;
    } else if (this.state.currently_viewing === ownedString) {
      rec = this.state.owned_recipes;
    } else if (this.state.currently_viewing === madeThisString) {
      rec = this.state.made_recipes;
    }

    let dim = doc.getTextDimensions('Text');
    let y = 0;
    for (let i = 0; i < rec.length; i++) {
      y = 20;
      doc.setFontSize(35);

      const lines = doc.splitTextToSize(rec[i].name, 170);
      doc.text(20, y, lines);
      dim = doc.getTextDimensions(lines);
      y += dim.h - 30;

      doc.setFontSize(14);
      const desc = rec[i].description;
      const desclines = doc.splitTextToSize(desc, 170);
      doc.text(20, y, desclines);
      dim = doc.getTextDimensions(desclines);
      y += dim.h;

      doc.setFontSize(25);
      doc.text(20, y, 'Ingredients');
      dim = doc.getTextDimensions('Ingredients');
      y += dim.h - 20;
      doc.setFontSize(14);
      const ingredients = rec[i].ingredients;
      for (let j = 0; j < ingredients.length; j++) {
        const ing = ingredients[j];
        doc.text(20, y, ing);
        dim = doc.getTextDimensions(ing);
        y += dim.h - 10;
      }

      y += 10;
      doc.setFontSize(25);
      doc.text(20, y, 'Instructions');
      dim = doc.getTextDimensions('Instructions');
      y += dim.h - 20;
      doc.setFontSize(14);
      const inst = rec[i].instructions;
      for (let m = 0; m < inst.length; m++) {
        const lines = doc.splitTextToSize(inst[m], 170);
        doc.text(20, y, lines);
        dim = doc.getTextDimensions(lines);
        y += dim.h - 5; // WHY IS THE LAST INSTRUCTION NOT IN THE RIGH SPOT!!!!????
        if (m + 2 >= inst.length) {
          y += 12;
        }
      }

      if (i + 1 < rec.length) {
        doc.addPage('a4', 'p');
      }
    }
    doc.save('recipes.pdf');
  }

  followUser = async () => {
    console.log(
      'vieweing profile for user: ',
      this.state.username,
      ', id: ',
      this.state.user_id
    );

    try {
      const { client } = this.props;
      const user = await this.fetchUser();
      console.log('logged in name: ', user.username, ' id: ', user.id);

      const result = client
        .mutate({
          mutation: gql`
          mutation FollowUser {
            followUser(
              userId: "${user.id}"
              followingId: "${this.state.user_id}"
            ) {
              id
              username
              followers {username}
              following {username}
            }
          }
          `
        })
        .then(result => {
          console.log('user followed: ', result.data);
          return result.data;
        });
      return result;
    } catch (err) {
      console.log(err);
      return {};
    }
  };

  async getDataFromAPI() {
    let user;
    if (this.props.match.params.username) {
      user = await this.fetchOtherUser();
    } else {
      user = await this.fetchUser();
    }

    console.log('user: \n', user);
    this.setState(
      {
        user_id: user.id,
        username: user.username,
        owned_recipes: user.ownedRecipes,
        saved_recipes: user.savedRecipes,
        made_recipes: user.madeRecipes,
        following: user.following,
        followers: user.followers,
        user_image: user.profilePicture,
        owned_recipes_searching: user.ownedRecipes,
        saved_recipes_searching: user.savedRecipes,
        made_recipes_searching: user.madeRecipes
      },
      () => this.setLengths()
    );
  }

  setLengths() {
    this.setState({
      owned_recipes_length: this.state.owned_recipes.length,
      saved_recipes_length: this.state.saved_recipes.length,
      made_recipes_length: this.state.made_recipes.length,
      following_length: this.state.following.length,
      followers_length: this.state.followers.length
    });
  }

  // get the info of the logged in user
  fetchUser = async () => {
    try {
      const { client, token } = this.props;
      const decoded = jwt.decode(token);
      console.log('decoded is this: ', decoded.id);
      const result = client
        .query({
          query: gql`{           
            userById(
              id: "${decoded.id}"
            ) {
              id
              username
              ownedRecipes (limit: 100) {name id description images ingredients instructions}
              savedRecipes {name id description images ingredients instructions}
              madeRecipes {name id description images ingredients instructions}
              following {id username profilePicture}
              followers {id username profilePicture}
              profilePicture
            }
          }
        `,
          fetchPolicy: 'network-only'
        })
        .then(result => {
          console.log('fetchUser: ', result.data.userById);
          return result.data.userById;
        });
      return result;
    } catch (err) {
      console.log(err);
      return {};
    }
  };

  // get the info when viewing anothers profile
  fetchOtherUser = async () => {
    console.log('get other user: ', this.props.match.params.username);
    try {
      const { client } = this.props;
      const result = client
        .query({
          query: gql`{           
            userByUsername(
              username: "${this.props.match.params.username}"
            ) {
              id
              username
              ownedRecipes {name id description images}
              savedRecipes {name id description images}
              madeRecipes {name id description images}
              following {id username profilePicture}
              followers {id username profilePicture}
              profilePicture
            }
          }
        `,
          fetchPolicy: 'network-only'
        })
        .then(result => {
          console.log('data got back: \n', result.data.userByUsername);
          return result.data.userByUsername;
        });
      return result;
    } catch (err) {
      console.log('Error: ', err);
      return {};
    }
  };

  isMyProfile() {
    let myProfile = true;
    if (this.props.match.params.username) {
      myProfile = false; // viewing somebody elses profile
    } else {
      myProfile = true;
    }

    return myProfile;
  }
  
  deleteOwned = async recipeId => {
    const owned = this.state.owned_recipes.filter(
      recipe => recipe.id !== recipeId
    );
    this.setState({
      owned_recipes: owned,
      owned_recipes_length: owned.length
    });
    const { client } = this.props;
    client.mutate({
      mutation: gql`
        mutation deleteOwned($recipeId: String!) {
          deleteRecipe(id: $recipeId)
        }
      `,
      variables: {
        recipeId
      }
    });
  };

  deleteSaved = async recipeId => {
    const saved = this.state.saved_recipes.filter(
      recipe => recipe.id !== recipeId
    );
    this.setState({
      saved_recipes: saved,
      saved_recipes_length: saved.length
    });
    const { client, userId } = this.props;
    client.mutate({
      mutation: gql`
        mutation($recipeId: String!, $userId: String!) {
          deleteSavedRecipe(recipeId: $recipeId, userId: $userId)
        }
      `,
      variables: {
        recipeId,
        userId
      }
    });
  };

  removeMadeRecipe = async recipeId => {
    const made = this.state.made_recipes.filter(
      recipe => recipe.id !== recipeId
    );
    this.setState({
      made_recipes: made,
      made_recipes_length: made.length
    });
    const { client, userId } = this.props;
    client.mutate({
      mutation: gql`
        mutation($recipeId: String!, $userId: String!) {
          toggleIMadeThis(userId: $userId, recipeId: $recipeId, newVal: false) {
            username
          }
        }
      `,
      variables: {
        recipeId,
        userId
      }
    });
  };

  unfollow = async followingId => {
    this.setState({
      follow: false
    });
    const { client, userId } = this.props;
    client.mutate({
      mutation: gql`
        mutation($followingId: String!, $userId: String!) {
          unfollowUser(userId: $userId, followingId: $followingId) {
            username
          }
        }
      `,
      variables: {
        followingId,
        userId
      }
    });
  };

  follow = async followingId => {
    this.setState({ following: true });
    const { client, userId } = this.props;
    client.mutate({
      mutation: gql`
        mutation($followingId: String!, $userId: String!) {
          followUser(userId: $userId, followingId: $followingId) {
            following {
              id
              username
              profilePicture
            }
          }
        }
      `,
      variables: {
        followingId,
        userId
      }
    });
  };

  toggleFollow = newVal => {
    if (newVal) {
      this.follow(this.state.user_id);
    } else {
      this.unfollow(this.state.user_id);
    }
  };

  render() {
    // don't render until we have data loaded
    if (!this.state.username) {
      return <Loading />;
    }

    let exportString = '';

    if (this.state.currently_viewing === savedString) {
      exportString = 'Export Saved Recipes';
    } else if (this.state.currently_viewing === ownedString) {
      exportString = 'Export Owned Recipes';
    } else if (this.state.currently_viewing === madeThisString) {
      exportString = 'Export Made Recipes';
    }

    let savedShow = true;
    let ownedShow = false;
    let followShow = false;
    let madeThisShow = false;
    if (this.state.currently_viewing === savedString) {
      savedShow = true;
      ownedShow = false;
      followShow = false;
      madeThisShow = false;
    } else if (this.state.currently_viewing === ownedString) {
      savedShow = false;
      ownedShow = true;
      followShow = false;
      madeThisShow = false;
    } else if (this.state.currently_viewing === followingString) {
      savedShow = false;
      ownedShow = false;
      followShow = true;
      madeThisShow = false;
    } else if (this.state.currently_viewing === madeThisString) {
      savedShow = false;
      ownedShow = false;
      followShow = false;
      madeThisShow = true;
    }

    return (
      <div style={{ display: 'flex' }}>
        <Grid
          className="user-container"
          container
          spacing={styles.spacing}
          justify={'center'}
        >
          <Grid
            className="picture"
            item
            xs={styles.sizes.xs.picture}
            sm={styles.sizes.sm.picture}
          >
            <ProfilePicture
              name={this.state.username}
              imageURL={this.state.user_image}
              viewingMyProfile={this.isMyProfile()}
            />
          </Grid>
          <Grid
            className="social"
            item
            xs={styles.sizes.xs.social}
            sm={styles.sizes.sm.social}
          >
            <Social
              owned_recipes_number={this.state.owned_recipes_length}
              saved_recipes_number={this.state.saved_recipes_length}
              made_this_number={this.state.made_recipes_length}
              following_number={this.state.following_length}
              showResults={this.showResults}
              my_profile={this.isMyProfile()}
              followUser={this.followUser}
            />
          </Grid>
          <Grid item sm={8} xs={12}>
            {!followShow && !madeThisShow && ( // don't show search box if they are looking at followers
              <Spring
                from={{ marginTop: 0 }}
                to={
                  this.state.saved_recipes.length > 0
                    ? { marginTop: 10 }
                    : { marginTop: 10 }
                }
              >
                {({ marginTop }) => (
                  <div className="search-box" style={{ marginTop }}>
                    <Grid
                      className="search-box-grid"
                      container
                      justify={'center'}
                    >
                      <Grid item xs={9} sm={9}>
                        <FormControl fullWidth>
                          <InputLabel htmlFor="search">
                            Search for a recipe...
                          </InputLabel>
                          <Input
                            id="search"
                            onKeyPress={this.handleEnterSearch}
                            onChange={this.handleQueryChange}
                            endAdornment={
                              <InputAdornment position="end">
                                <Button
                                  id="searchButton"
                                  onClick={this.handleButtonSearch}
                                >
                                  <i class="material-icons">search</i>
                                </Button>
                              </InputAdornment>
                            }
                          />
                        </FormControl>
                      </Grid>

                      {!followShow &&
                      this.isMyProfile() && ( // don't show export if they are looking at followers
                        <Grid item xs={3} sm={3}>
                          <Button
                            variant="contained"
                            color="secondary"
                            Title="Export to PDF"
                            className="export-recipes-button"
                            onClick={this.exportToPdf}
                          >
                            <Icon>picture_as_pdf</Icon>
                            {exportString}
                          </Button>
                        </Grid>
                      )}
                    </Grid>
                  </div>
                )}
              </Spring>
            )}
          </Grid>

          <Grid
            className="users-recipes"
            item
            xs={styles.sizes.xs.recipes}
            sm={styles.sizes.sm.recipes}
          >
            <div className="search-results">
              {savedShow && (
                <Grid container>
                  <Trail
                    native
                    keys={this.state.saved_recipes_searching.map(
                      item => item.id
                    )}
                    from={{ marginTop: 500, opacity: 0 }}
                    to={{ marginTop: 0, opacity: 1 }}
                  >
                    {this.state.saved_recipes_searching.map(
                      recipe => (marginTop, index) => {
                        return (
                          <Grid item md={4} sm={6} xs={6} zeroMinWidth>
                            <animated.div key={index} style={marginTop}>
                              <SearchResult
                                key={recipe.id}
                                name={recipe.name}
                                style={marginTop}
                                description={recipe.description}
                                images={recipe.images}
                                r_id={recipe.id}
                                onDelete={() => this.deleteSaved(recipe.id)}
                              />
                            </animated.div>
                          </Grid>
                        );
                      }
                    )}
                  </Trail>
                </Grid>
              )}

              {ownedShow && (
                <Grid container>
                  <Trail
                    native
                    keys={this.state.owned_recipes_searching.map(
                      item => item.id
                    )}
                    from={{ marginTop: 500, opacity: 0 }}
                    to={{ marginTop: 0, opacity: 1 }}
                  >
                    {this.state.owned_recipes_searching.map(
                      recipe => (marginTop, index) => {
                        return (
                          <Grid item md={4} sm={6} xs={6} zeroMinWidth>
                            <animated.div key={index} style={marginTop}>
                              <SearchResult
                                key={recipe.id}
                                name={recipe.name}
                                style={marginTop}
                                description={recipe.description}
                                images={recipe.images}
                                r_id={recipe.id}
                                onDelete={() => this.deleteOwned(recipe.id)}
                              />
                            </animated.div>
                          </Grid>
                        );
                      }
                    )}
                  </Trail>
                </Grid>
              )}

              {madeThisShow && (
                <Grid container>
                  <Trail
                    native
                    keys={this.state.made_recipes_searching.map(
                      item => item.id
                    )}
                    from={{ marginTop: 500, opacity: 0 }}
                    to={{ marginTop: 0, opacity: 1 }}
                  >
                    {this.state.made_recipes_searching.map(
                      recipe => (marginTop, index) => {
                        return (
                          <Grid item md={4} sm={6} xs={6} zeroMinWidth>
                            <animated.div key={index} style={marginTop}>
                              <SearchResult
                                key={recipe.id}
                                name={recipe.name}
                                style={marginTop}
                                description={recipe.description}
                                images={recipe.images}
                                r_id={recipe.id}
                                onDelete={() =>
                                  this.removeMadeRecipe(recipe.id)
                                }
                              />
                            </animated.div>
                          </Grid>
                        );
                      }
                    )}
                  </Trail>
                </Grid>
              )}

              {followShow && (
                <Grid container>
                  <Trail
                    native
                    keys={this.state.following.map(item => item.id)}
                    from={{ marginTop: 500, opacity: 0 }}
                    to={{ marginTop: 0, opacity: 1 }}
                  >
                    {this.state.following.map(
                      userProfile => (marginTop, index) => {
                        return (
                          <Grid item md={4} sm={6} xs={6} zeroMinWidth>
                            <animated.div key={index} style={marginTop}>
                              <FollowingProfile
                                key={userProfile.id}
                                name={userProfile.username}
                                style={marginTop}
                                images={userProfile.profilePicture}
                                r_id={userProfile.username}
                                onDelete={() => this.unfollow(userProfile.id)}
                              />
                            </animated.div>
                          </Grid>
                        );
                      }
                    )}
                  </Trail>
                </Grid>
              )}
            </div>
          </Grid>
        </Grid>
        <Route
          render={({ history }) => (
            <Fab
              color="primary"
              style={{ position: 'fixed', bottom: 20, right: 30 }}
              onClick={() => {
                history.push('/createrecipe');
              }}
            >
              <Create />
            </Fab>
          )}
        />
      </div>
    );
  }
}

export default compose(
  withLocalData,
  withApollo
)(Profile);
