import React, { Component } from 'react';
import { withApollo } from 'react-apollo';
import { Redirect } from 'react-router-dom';

class SignOut extends Component {
  componentDidMount() {
    localStorage.removeItem('FTM_TOKEN');
    this.props.client.writeData({ data: { token: '', userId: '' } });
  }

  render() {
    return <Redirect to="/" />;
  }
}

export default withApollo(SignOut);
