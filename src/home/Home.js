import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Input,
  InputAdornment,
  InputLabel,
  Button,
  FormControl,
  withStyles,
  Grid,
} from '@material-ui/core';
import { Spring, Trail, animated } from 'react-spring';
import { withApollo, compose } from 'react-apollo';
import gql from 'graphql-tag';
import SearchResult from './SearchResult/SearchResult';
import './Home.css';
import TimeFilterButton from './FilterButton/TimeFilterButton';
import LevelsFilterButton from './FilterButton/LevelsFilterButton';
import FilterChipsArray from './FilterChip/FilterChipsArray';
import FilterDialog from './FilterDialog/FilterDialog';

const styles = {
  gridList: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    overflow: 'hidden',
  },
  heading: {},
  secondaryHeading: {},
  column: {
    flexBasis: '33.33%',
    width: '30%',
  },
};

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      query: '',
      filters: [],
      recipes: [],
      loading: false,
      hasFilterChips: false,
    };
    this.filterChipsRef = React.createRef();
  }

  handleEnterSearch = async (event) => {
    const { client } = this.props;
    if (event.key === 'Enter') {
      const { data } = await client.query({
        query: gql`
          query searchAllRecipes($query: String!, $filters: [SearchFilter]!) {
            searchAllRecipes(query: $query, filters: $filters) {
              id
              name
              description
              images
              cookTime
              prepTime
              difficulty
              rating
              ingredients
            }
          }
        `,
        variables: {
          query: this.state.query,
          filters: this.state.filters,
        },
        fetchPolicy: 'network-only',
      });
      this.setState({
        loading: true,
        recipes: data.searchAllRecipes,
      });
    }
  };

  handleButtonSearch = async () => {
    const { client } = this.props;
    const { data } = await client.query({
      query: gql`
        query searchAllRecipes($query: String!, $filters: [SearchFilter]!) {
          searchAllRecipes(query: $query, filters: $filters) {
            id
            name
            description
            images
            cookTime
            prepTime
            difficulty
            rating
            ingredients
          }
        }
      `,
      variables: {
        query: this.state.query,
        filters: this.state.filters,
      },
      fetchPolicy: 'network-only',
    });
    this.setState({
      loading: true,
      recipes: data.searchAllRecipes,
    });
  };

  handleQueryChange = (event) => {
    this.setState({
      query: event.target.value,
    });
  };

  handleAddFilterChip = (title, label) => {
    this.filterChipsRef.current.handleAddFilterChip(title, label);
    const currentFilters = [...this.state.filters];
    console.log(label);
    const args = label.split(' ');
    switch (title) {
    case 'Cook Time':
      switch (args[0]) {
      case '<=':
        currentFilters.push({ field: 'cookTime', operator: 'LTE', value: [args[1]] });
        break;
      case '>=':
        currentFilters.push({ field: 'cookTime', operator: 'GTE', value: [args[1]] });
        break;
      case '==':
        currentFilters.push({ field: 'cookTime', operator: 'EQ', value: [args[1]] });
        break;
      default:
      }
      break;
    case 'Prep. Time':
      switch (args[0]) {
      case '<=':
        currentFilters.push({ field: 'prepTime', operator: 'LTE', value: [args[1]] });
        break;
      case '>=':
        currentFilters.push({ field: 'prepTime', operator: 'GTE', value: [args[1]] });
        break;
      case '==':
        currentFilters.push({ field: 'prepTime', operator: 'EQ', value: [args[1]] });
        break;
      default:
      }
      break;
    case 'Difficulty':
      currentFilters.push({ field: 'difficulty', operator: 'GTE', value: [args[0]] });
      break;
    case 'Rating':
      currentFilters.push({ field: 'rating', operator: 'GTE', value: [args[0]] });
      break;
    default:
    }
    this.setState({ filters: currentFilters });
  };

  handleHasFilterChips = (value) => {
    this.setState({ hasFilterChips: value });
  };

  handleIngredientsFilter = (includes, excludes) => {
    this.filterChipsRef.current.handleAddIngredientChips(includes, excludes);
  };

  handleDeleteFilterChips = (data) => {
    this.setState((state, props) => {
      const filters = [...state.filters];
      filters.splice(data.key, 1);
      return { filters };
    });
  };

  render() {
    return (
			<div className="home-container">
        <Spring
          native
          from={{ height: 390, opacity: 1.0 }}
          to={
            this.state.recipes.length > 0 ? { height: 0, opacity: 0.0 } : { height: 390, opacity: 1.0 }
          }
        >
          {({ height, opacity }) => (
						<animated.div className="logo" style={{ height, opacity }}>
              <img src="http://i63.tinypic.com/14joi09.png" alt="logo" />
            </animated.div>
          )}
        </Spring>
        <Spring
          from={{ marginTop: 0 }}
          to={this.state.recipes.length > 0 ? { marginTop: 0 } : { marginTop: 0 }}
        >
          {({ marginTop }) => (
            <div className="search-box" style={{ marginTop }}>
              <FormControl fullWidth>
                <InputLabel htmlFor="search">Search for a recipe...</InputLabel>
								<Input
									autoFocus
									id="search"
                  onKeyPress={this.handleEnterSearch}
                  onChange={this.handleQueryChange}
                  endAdornment={
                    <InputAdornment position="end">
                      <Button id="searchButton" onClick={this.handleButtonSearch}>
                        Search
                      </Button>
                    </InputAdornment>
                  }
                />
              </FormControl>
            </div>
          )}
        </Spring>
        <Spring
          native
          from={{ height: 0, opacity: 0 }}
          to={this.state.hasFilterChips ? { height: 50, opacity: 1 } : { height: 0, opacity: 0 }}
        >
          {({ height, opacity }) => (
            <animated.div className="search-chips" style={{ display: 'flex', height, opacity }}>
              <FilterChipsArray
                innerRef={this.filterChipsRef}
                handleHasFilterChips={this.handleHasFilterChips}
                handleDeleteFilterChips={this.handleDeleteFilterChips}
              />
            </animated.div>
          )}
        </Spring>
        <div
          className="search-filters"
          style={
            this.state.recipes.length > 0
              ? {
                marginTop: 0,
                display: 'flex',
                alignItems: 'center',
              }
              : {
                marginTop: 0,
                display: 'flex',
                alignItems: 'center',
              }
          }
        >
          <TimeFilterButton title="Cook Time" handleAddFilterChip={this.handleAddFilterChip} />
          <TimeFilterButton title="Prep. Time" handleAddFilterChip={this.handleAddFilterChip} />
          <LevelsFilterButton title="Difficulty" handleAddFilterChip={this.handleAddFilterChip} />
          <LevelsFilterButton title="Rating" handleAddFilterChip={this.handleAddFilterChip} />
          <FilterDialog handleIngredientsFilter={this.handleIngredientsFilter} />
        </div>

        <div
          className="search-results"
          style={this.state.recipes.length > 0 ? { marginTop: 0 } : { marginTop: 0 }}
        >
          {this.state.recipes.length > 0 && (
            <Grid container>
              <Trail
                native
                keys={this.state.recipes.map(item => item.id)}
                from={{ marginTop: 500, opacity: 0 }}
                to={{ marginTop: 0, opacity: 1 }}
              >
                {this.state.recipes.map(recipe => (marginTop, index) => {
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
													rating={recipe.rating}
                        />
                      </animated.div>
                    </Grid>
                  );
                })}
              </Trail>
            </Grid>
          )}
        </div>
      </div>
    );
  }
}

Home.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default compose(
  withStyles(styles),
  withApollo,
)(Home);
