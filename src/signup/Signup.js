import React, { Component } from 'react';
import { Button, TextField } from '@material-ui/core';
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import './Signup.css';
import fbLogo from '../assets/images/fb-logo.png';
import ggLogo from '../assets/images/g-ico.png';
import Auth from '../auth/Auth';

class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      username: '',
      password: '',
      passConfirm: '',
    };
  }

  auth = new Auth();

  loginGoogle = () => {
    this.auth.loginGoogle();
  };

  loginFacebook = () => {
    this.auth.loginFacebook();
  };

  handleSubmit = async () => {
    const { client, history } = this.props;
    const { data } = await client.mutate({
      mutation: gql`
          mutation { createUser(
            username: "${this.state.username}" 
            password: "${this.state.password}") {
              token
          }
        }
      `,
    });
    localStorage.setItem('FTM_TOKEN', data.createUser.token);
    client.writeData({ data: { token: data.createUser.token } });
    history.replace('/');
  };

  render() {
    return (
      <form className="login-root">
        <div className="social-buttons">
          <Button
            onClick={this.loginFacebook}
            variant="contained"
            color="primary"
            id="fb-btn"
          >
            <img id="fb-logo" alt="fb-logo" src={fbLogo} />
            Signup With Facebook
          </Button>
          <Button
            onClick={this.loginGoogle}
            variant="contained"
            id="google-btn"
          >
            <img id="gg-logo" alt="gg-logo" src={ggLogo} />
            Signup With Google
          </Button>
        </div>
        <TextField
          type="text"
          label="Email"
          fullWidth
          className="email"
          onChange={event => this.setState({ email: event.target.value })}
        />
        <TextField
          label="Username"
          type="text"
          fullWidth
          className="username"
          onChange={event => this.setState({ username: event.target.value })}
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          className="password"
          onChange={event => this.setState({ password: event.target.value })}
        />
        <TextField
          label="Verify Password"
          type="password"
          fullWidth
          className="verify"
          onChange={event => this.setState({ passConfirm: event.target.value })}
        />
        <Button
          variant="contained"
          color="primary"
          className="submit-btn"
          onClick={this.handleSubmit}
        >
          Submit
        </Button>
      </form>
    );
  }
}

export default withApollo(SignUp);
