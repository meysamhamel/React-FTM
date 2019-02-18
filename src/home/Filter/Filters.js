import React, { Component } from 'react';
import HomeFilter from './Filter';
import './Filters.css';


class HomeFilters extends Component {
  arr = ['Time', 'Difficulty', 'Ingredients', 'Author', 'Cuisine', 'Tags', 'Diet', 'Rating']

  render() {
    return (
      <div className="filters-root">
        {this.arr.map(filter => <HomeFilter key={filter} filter={filter} />)}
      </div>
    );
  }
}

export default HomeFilters;
