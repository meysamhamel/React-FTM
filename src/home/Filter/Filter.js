import React, { Component } from 'react';
import { Tabs, Tab } from '@material-ui/core';
import './Filter.css';

class HomeFilter extends Component {
  state = {
    selectedTab: 'item'
  };

  render() {
    return (
      <Tabs
        value={this.state.selectedTab}
        centered
        indicatorColor="primary"
        textColor="primary"
      >
        <Tab label="item" value="item" />
        <Tab label="item2" value="item2" />
      </Tabs>
    );
  }
}

export default HomeFilter;
