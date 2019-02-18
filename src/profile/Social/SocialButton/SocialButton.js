import React, { Component } from 'react';

import { Card, Icon } from '@material-ui/core';
import '../Social.css';

class SocialButton extends Component {

  render() {
    return (
      <Card className={this.props.classActive ? 'num-container btn-active' : 'num-container'} onClick={() => this.props.delegateShowResults(this.props.delegateShow)}>
        <Icon>{this.props.icon}</Icon>
        <span className="number">{this.props.number}</span><br />
        <span>{this.props.title}</span>
      </Card>
    );
  }
}

export default SocialButton;
