import React, { Component } from 'react';
import Auth from '../auth/Auth';
import CallbackLogic from './CallbackLogic';
import Loading from '../loading/Loading';
import { Redirect } from 'react-router-dom';

const auth = new Auth();

class CallbackReceiver extends Component {
  state = {
    id: ''
  };

  async componentDidMount() {
    if (!this.props.token) {
      const id = await auth.handleAuthCallback();
      this.setState({ id });
    }
  }

  render() {
    if (this.props.token) {
      return <Redirect to="/" />;
    }
    return (
      <div>
        {this.state.id ? (
          <CallbackLogic id={this.state.id} source={this.props.source} />
        ) : (
          <Loading />
        )}
      </div>
    );
  }
}

export default CallbackReceiver;
