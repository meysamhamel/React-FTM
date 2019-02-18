import React, { Component } from 'react';
import { Grid, Button, TextField, Fab } from '@material-ui/core';
import { Favorite, FavoriteBorder } from '@material-ui/icons';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Icon from '@material-ui/core/Icon';
import gql from 'graphql-tag';
import { withApollo, compose } from 'react-apollo';
import {
  FacebookShareButton,
  FacebookIcon,
  TwitterShareButton,
  TwitterIcon
} from 'react-share';
import './Recipe.css';
import Loading from '../loading/Loading';
import RecipeInstructions from './Instructions/Instructions';
import RecipeInfo from './Info/Info';
import RecipeIngredients from './Ingredients/Ingredients';
import RecipeDescription from './Description/Description';
import RecipePicture from './Picture/Picture';
import Notes from './Notes/Notes';
import Comments from './Comments/Comments';
import withLocalData from '../withLocalData';
import Fraction from 'fraction.js';
import * as jsPDF from 'jspdf';
// import { PDFDownloadLin, BlobProvider } from '@react-pdf/renderer';
// import { PDF2 } from '../recipePdf/PDF';
const styles = {
  spacing: 24,
  sizes: {
    xs: {
      picture: 8,
      description: 8,
      ingredients: 8,
      instructions: 8,
      author: 8,
      title: 8
    },
    sm: {
      picture: 4,
      description: 4,
      ingredients: 8,
      instructions: 8,
      author: 8,
      title: 8
    }
  }
};

class Recipe extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scale: 1,
      ingredients: [],
      instructions: [],
      instructionImages: [],
      description: null,
      image: [],
      title: null,
      stars: null,
      tags: [],
      author: null,
      authorImage: null,
      cookTime: null,
      prepTime: null,
      difficulty: null,
      sourceURL: null,
      servings: null,
      recipe_id: this.props.match.params.id,
      notes: null,
      comments: null,
      new_note: null,
      new_comment: null,
      note_dialog_open: false,
      comment_dialog_open: false,
      authorId: null,
      published: null
    };
    this.saveRecipe = this.saveRecipe.bind(this);
    this.removeRecipe = this.removeRecipe.bind(this);
    // this.printRecipe = this.printRecipe.bind(this);
    this.noteSubmit = this.noteSubmit.bind(this);
    this.commentSubmit = this.commentSubmit.bind(this);
    this.addNote = this.addNote.bind(this);
    this.postComment = this.postComment.bind(this);
    this.handleDialogClose = this.handleDialogClose.bind(this);
    this.handleDialogOpen = this.handleDialogOpen.bind(this);
    this.handleCommentClose = this.handleCommentClose.bind(this);
    this.handleCommentOpen = this.handleCommentOpen.bind(this);
    this.handleNoteInput = this.handleNoteInput.bind(this);
    this.iMadeThis = this.iMadeThis.bind(this);
    this.exportToPDF = this.exportToPDF.bind(this);
    this.isUserLoggedIn = this.isUserLoggedIn.bind(this);
    this.userIsOwner = this.userIsOwner.bind(this);
    this.publishRecipe = this.publishRecipe.bind(this);
    this.exportToPDF = this.exportToPDF.bind(this);
  }

  isUserLoggedIn() {
    const { userId } = this.props;
    return !(userId === null || userId === '');
  }

  handleDialogOpen = () => {
    this.setState({ note_dialog_open: true });
  };

  handleDialogClose = () => {
    this.setState({ note_dialog_open: false });
  };
  handleCommentOpen = () => {
    this.setState({ comment_dialog_open: true });
  };

  handleCommentClose = () => {
    this.setState({ comment_dialog_open: false });
  };

  handleNoteInput = event => {
    this.setState({
      new_note: event.target.value
    });
  };

  handleCommentInput = event => {
    this.setState({
      new_comment: event.target.value
    });
  };

  publishRecipe() {
    console.log('publish this recipe');
    const { client } = this.props;
    const data = {
      recipeid: this.state.recipe_id
    };
    client
      .mutate({
        mutation: gql`
          mutation UpdateRecipe($id: String, $recipe: UpdateRecipeInput) {
            updateRecipe(id: $id, recipe: $recipe) {
              id
              published
            }
          }
        `,
        variables: {
          recipe: {
            published: true
          },
          id: data.recipeid
        }
      })
      .then(result => {
        console.log('published: ', result.data);
        this.setState({ published: result.data.updateRecipe.published });
      })
      .catch(err => {
        console.log('failed to publish, err: ');
        console.log(err);
      });
  }
  iMadeThis() {
    this.setState({ iMadeThis: !this.state.iMadeThis });
    try {
      const { client, userId } = this.props;
      const data = {
        user_id: userId,
        recipe_id: this.state.recipe_id
      };
      const result = client
        .mutate({
          mutation: gql`
            mutation MadeThis {
              toggleIMadeThis(
                userId: "${data.user_id}"
                recipeId: "${data.recipe_id}"
                newVal: true
              ) {
                madeRecipes { name }
              }
            }`
        })
        .then(result => {
          console.log('made this result: ', result);
          return result;
        });
      return result;
    } catch (err) {
      console.log(err);
      return {};
    }
  }

  exportToPDF() {
    const doc = new jsPDF('pt');

    let dim = doc.getTextDimensions('Text');
    let y = 0;
    y = 20;
    doc.setFontSize(35);

    const lines = doc.splitTextToSize(this.state.title, 170);
    doc.text(20, y, lines);
    dim = doc.getTextDimensions(lines);
    y += dim.h - 30;

    doc.setFontSize(14);
    const desc = this.state.description;
    const desclines = doc.splitTextToSize(desc, 170);
    doc.text(20, y, desclines);
    dim = doc.getTextDimensions(desclines);
    y += dim.h;

    doc.setFontSize(25);
    doc.text(20, y, 'Ingredients');
    dim = doc.getTextDimensions('Ingredients');
    y += dim.h - 20;
    doc.setFontSize(14);
    const ingredients = this.state.ingredients;
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
    const inst = this.state.instructions;
    for (let m = 0; m < inst.length; m++) {
      const lines = doc.splitTextToSize(inst[m], 170);
      doc.text(20, y, lines);
      dim = doc.getTextDimensions(lines);
      y += dim.h - 5; // WHY IS THE LAST INSTRUCTION NOT IN THE RIGH SPOT!!!!????
      if (m + 2 >= inst.length) {
        y += 12;
      }
    }

    doc.save(`${this.state.title}-recipe.pdf`);
  }

  recipeAlreadySaved(recipeId) {
    try {
      const { client, userId } = this.props;
      const data = {
        user_id: userId,
        recipe_id: this.state.recipe_id
      };
      console.log(this.state.title);
      console.log(userId);
      const result = client
        .query({
          query: gql`
          query {
            searchSavedRecipes(userId: "${userId}" query: "${
            this.state.title
          }") {
              id
              name
            }
          }`,
          fetchPolicy: 'network-only'
        })
        .then(result => {
          if (result.data.searchSavedRecipes.length === 0) {
            console.log(result.data.searchSavedRecipes);
            console.log('adding to empty');
            return false;
          } else if (
            result.data.searchSavedRecipes.filter(
              recipe => recipe.id === data.recipe_id
            )
          ) {
            console.log('already exist');
            return true;
          }
          console.log('addingggg');
          return false;
        });
      return result;
    } catch (err) {
      return {};
    }
  }

  toggleSavedRecipe = () => {
    this.setState({ recipeAlreadySaved: !this.state.recipeAlreadySaved });
    if (this.state.recipeAlreadySaved) {
      this.removeRecipe();
    } else {
      this.saveRecipe();
    }
  };

  saveRecipe = () => {
    try {
      const { client, userId } = this.props;

      return client.mutate({
        mutation: gql`
          mutation SaveRecipe($userId: String!, $recipeId: String!) {
            addSavedRecipe(userId: $userId, recipeId: $recipeId) {
              id
            }
          }
        `,
        variables: {
          userId,
          recipeId: this.state.recipe_id
        }
      });
    } catch (err) {}
  };

  removeRecipe = () => {
    try {
      const { client, userId } = this.props;
      return client.mutate({
        mutation: gql`
          mutation RemoveRecipe($userId: String!, $recipeId: String!) {
            deleteSavedRecipe(userId: $userId, recipeId: $recipeId)
          }
        `,
        variables: {
          userId,
          recipeId: this.state.recipe_id
        }
      });
    } catch (err) {
      return {};
    }
  };

  noteSubmit() {
    // append the new note to the current ones, then use callback to make api call
    this.setState(
      previousState => ({
        notes: [...previousState.notes, this.state.new_note]
      }),
      this.addNote
    );
  }

  addNote() {
    try {
      const { client } = this.props;
      const data = {
        notes: this.state.notes,
        recipe_id: this.state.recipe_id
      };
      const result = client
        .mutate({
          mutation: gql`
          mutation UpdateRecipe($recipe: UpdateRecipeInput!) {           
            updateRecipe(
              id: "${data.recipe_id}"
              recipe: $recipe
            ) {
              id
              name
              notes
            }
          }
        `,
          variables: {
            recipe: {
              notes: data.notes
            }
          }
        })
        .then(result => {
          this.handleDialogClose();
          return result.data;
        });
      return result;
    } catch (err) {
      return {};
    }
  }

  commentSubmit() {
    // append the new comment to the current ones, then use callback to make api call
    this.setState(
      previousState => ({
        comments: [...previousState.comments, this.state.new_comment]
      }),
      this.postComment
    );
  }

  postComment() {
    try {
      const { client } = this.props;
      const data = {
        comments: this.state.comments,
        recipe_id: this.state.recipe_id
      };
      const result = client
        .mutate({
          mutation: gql`
          mutation UpdateRecipe($recipe: UpdateRecipeInput!) {           
            updateRecipe(
              id: "${data.recipe_id}"
              recipe: $recipe
            ) {
              id
              name
              comments
            }
          }
        `,
          variables: {
            recipe: {
              comments: data.comments
            }
          }
        })
        .then(result => {
          this.handleCommentClose();
          return result.data;
        });
      return result;
    } catch (err) {
      return {};
    }
  }

  componentWillMount() {
    this.getDataFromAPI();
  }

  fetchRecipe = async () => {
    const { client, userId } = this.props;
    return client
      .query({
        query: gql`
          query getRecipe($recipeId: String!, $userId: String) {
            recipeById(id: $recipeId) {
              id
              created
              description
              system
              images
              name
              ingredients
              instructions
              sourceURL
              prepTime
              cookTime
              difficulty
              servings
              rating
              notes
              numReviews
              numShares
              tags
              comments
              author {
                id
                username
                profilePicture
              }
              iMadeThis(userId: $userId)
              published
            }
          }
        `,
        variables: {
          userId,
          recipeId: this.state.recipe_id
        }
      })
      .then(result => {
        return result.data.recipeById;
      })
      .catch(err => console.log(err));
  };

  getDataFromAPI = async () => {
    const recipe = await this.fetchRecipe();
    this.setState({
      title: recipe.name,
      author: recipe.author.username,
      image: recipe.images[0],
      instructionImages: recipe.images.slice(1),
      cookTime: recipe.cookTime,
      prepTime: recipe.prepTime,
      difficulty: recipe.difficulty,
      instructions: recipe.instructions,
      ingredients: recipe.ingredients,
      tags: recipe.tags,
      description: recipe.description,
      sourceURL: recipe.sourceURL,
      servings: recipe.servings,
      scale: recipe.servings,
      stars: Math.round(recipe.rating),
      notes: recipe.notes,
      comments: recipe.comments,
      authorId: recipe.author.id,
      iMadeThis: recipe.iMadeThis,
      published: recipe.published,
      authorImage: recipe.author.profilePicture
    });
    if (
      recipe.author.profilePicture == null ||
      recipe.author.profilePicture === ''
    ) {
      this.setState({
        authorImage:
          'https://s3-us-west-2.amazonaws.com/foodtomake-photo-storage/person5-128.png'
      });
    }
  };

  handleScaleChange = ({ target: { value } }) => {
    if (!value || Number(value) < 1) {
      this.setState({ scale: 1 });
      return;
    }
    this.setState({ scale: value });
  };

  getScaledIngredients = () => {
    return this.state.ingredients.map(ingredient => {
      // eslint-disable-next-line
      const reg = /[0-9]+[0-9]*([\/][0-9]+[0-9]*)*/g;
      let result;
      let newIngredient = ingredient;
      const scale = new Fraction(
        this.state.scale,
        this.state.servings
      ).valueOf();
      while ((result = reg.exec(ingredient)) !== null) {
        const num = result[0];
        const newNum = new Fraction(num).mul(scale).toFraction(true);
        newIngredient = newIngredient.replace(num, newNum.toString());
      }
      return newIngredient;
    });
  };

  userIsOwner = () => {
    return (
      this.isUserLoggedIn() &&
      this.state.authorId !== null &&
      this.state.authorId === this.props.userId
    );
  };

  render() {
    // don't render until we have data loaded
    if (!this.state.title) {
      return <Loading />;
    }

    const isLoggedIn = this.isUserLoggedIn();
    const userOwnsRecipe = this.userIsOwner();
    console.log('user owns: ', userOwnsRecipe);
    console.log('logged in: ', isLoggedIn);

    const shareUrl = `http://www.foodtomake.com${this.props.location.pathname}`; // TODO:  Change this later for live

    return (
      <div>
        <Grid
          className="pic-des-container"
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
            <RecipePicture
              title={this.state.title}
              stars={this.state.stars}
              imageURL={this.state.image}
            />
          </Grid>
          <Grid
            className="description"
            item
            xs={styles.sizes.xs.description}
            sm={styles.sizes.sm.description}
          >
            <RecipeDescription desc={this.state.description} />
          </Grid>
          <Grid
            className="info"
            item
            xs={styles.sizes.xs.author}
            sm={styles.sizes.sm.author}
          >
            <RecipeInfo
              authorImage={this.state.authorImage}
              authorName={this.state.author}
              prepTime={this.state.prepTime}
              cookTime={this.state.cookTime}
              difficulty={this.state.difficulty}
              tags={this.state.tags}
              onScaleChange={this.handleScaleChange}
              servings={this.state.scale}
            />
          </Grid>
          <Grid
            className="ingredients"
            item
            xs={styles.sizes.xs.instructions}
            sm={styles.sizes.sm.instructions}
          >
            <RecipeIngredients
              ingredients={this.getScaledIngredients()}
              servings={this.state.servings}
            />
          </Grid>
          <Grid
            className="instructions"
            item
            xs={styles.sizes.xs.ingredients}
            sm={styles.sizes.sm.ingredients}
          >
            <RecipeInstructions
              value={this.state.instructions}
              images={this.state.instructionImages}
            />
          </Grid>
          <Grid className="recipe-buttons" container justify={'center'}>
            <Button
              variant="contained"
              color="secondary"
              title="print"
              className="print-button btn-margin"
              onClick={this.exportToPDF}
            >
              <i className="material-icons">print</i>
              Export to PDF
            </Button>
            {/* <BlobProvider document={PDF2}>
              {() => (
                <Button
                  variant="contained"
                  color="primary"
                  title="print"
                  className="print-button btn-margin"
                >
                  <i className="material-icons">print</i>
                  Export to PDF
                </Button>
              )}
            </BlobProvider> */}

            {userOwnsRecipe && (
              <Button
                variant="contained"
                color="secondary"
                title="Add Notes"
                className="btn-margin"
                onClick={this.handleDialogOpen}
              >
                <Icon>create</Icon>
                Add a Note
              </Button>
            )}

            {userOwnsRecipe && !this.state.published && (
              <Button
                variant="contained"
                color="secondary"
                title="Publish Recipe"
                className="btn-margin"
                onClick={this.publishRecipe}
              >
                <Icon>publish</Icon>
                Publish To Public
              </Button>
            )}

            {isLoggedIn && (
              <Button
                variant="contained"
                color={this.state.iMadeThis ? 'secondary' : 'default'}
                title="I Made This"
                className="i-made-this btn-margin"
                onClick={this.iMadeThis}
              >
                <Icon>restaurant_menu</Icon>
                {this.state.iMadeThis ? "You've Made This!" : 'I Made This!'}
              </Button>
            )}
            <Button
              variant="contained"
              color="secondary"
              className="post-comment-button btn-margin"
              onClick={this.handleCommentOpen}
              disabled={!isLoggedIn}
            >
              <Icon>add_icon</Icon>
              Post A Comment
            </Button>
            <Dialog
              open={this.state.note_dialog_open}
              onClose={this.handleDialogClose}
              aria-labelledby="form-dialog-title"
              fullWidth={true}
            >
              <DialogTitle id="form-dialog-title">New Note</DialogTitle>
              <DialogContent>
                <TextField
                  autoFocus
                  multiline
                  fullWidth
                  id="note-input"
                  label="New Note"
                  type="text"
                  onChange={this.handleNoteInput.bind(this)}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={this.handleDialogClose} color="primary">
                  Cancel
                </Button>
                <Button
                  onClick={this.noteSubmit}
                  color="primary"
                  variant="contained"
                >
                  Add Note
                </Button>
              </DialogActions>
            </Dialog>
          </Grid>
          <Grid
            className="comments"
            item
            xs={styles.sizes.xs.ingredients}
            sm={styles.sizes.sm.ingredients}
          >
            <Fab
              style={{
                position: 'absolute',
                bottom: 160,
                right: 20,
                backgroundColor: '#3b5998'
              }}
            >
              <FacebookShareButton url={shareUrl} className="share-btn">
                <FacebookIcon size={48} round={true} className="share-btn" />
              </FacebookShareButton>
            </Fab>
            <Fab
              style={{
                position: 'absolute',
                bottom: 90,
                right: 20,
                backgroundColor: '#00aced'
              }}
            >
              <TwitterShareButton url={shareUrl} className="share-btn">
                <TwitterIcon size={48} round={true} className="share-btn" />
              </TwitterShareButton>
            </Fab>
            <Fab
              style={{ position: 'absolute', bottom: 20, right: 20 }}
              color="primary"
              onClick={this.toggleSavedRecipe}
              disabled={!isLoggedIn}
            >
              {this.state.recipeAlreadySaved ? (
                <Favorite />
              ) : (
                <FavoriteBorder />
              )}
            </Fab>
            <Comments comments={this.state.comments} />
            {isLoggedIn ? (
              <div className="comment-loggedin">
                <Dialog
                  open={this.state.comment_dialog_open}
                  onClose={this.handleCommentClose}
                  aria-labelledby="comment-dialog-title"
                  className="comment-dialog"
                  fullWidth={true}
                >
                  <DialogTitle id="comment-dialog-title">
                    New Comment
                  </DialogTitle>
                  <DialogContent>
                    <TextField
                      autoFocus
                      multiline
                      id="comment-input"
                      label="New Comment"
                      type="text"
                      fullWidth
                      onChange={this.handleCommentInput}
                    />
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={this.handleCommentClose} color="primary">
                      Cancel
                    </Button>
                    <Button
                      onClick={this.commentSubmit}
                      color="primary"
                      variant="contained"
                    >
                      Post Comment
                    </Button>
                  </DialogActions>
                </Dialog>
              </div>
            ) : (
              <h3>Log in to post a comment</h3>
            )}
          </Grid>
          <Grid container>
            <span style={{ marginBottom: 10, marginLeft: 10 }}>
              <a
                href={
                  this.state.sourceURL === '' || this.state.sourceURL === null
                    ? 'http://www.foodtomake.com'
                    : this.state.sourceURL
                }
              >
                source
              </a>
            </span>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default compose(
  withLocalData,
  withApollo
)(Recipe);
