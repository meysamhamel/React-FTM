import React, { Component } from 'react';
import { Button, TextField } from '@material-ui/core';
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import './Login.css';
import Auth from '../auth/Auth';
import fbLogo from '../assets/images/fb-logo.png';
import ggLogo from '../assets/images/g-ico.png';
import { decode } from 'jsonwebtoken';

class Login extends Component {
  state = {
    account: '',
    password: ''
  };
  auth = new Auth();

  loginGoogle = () => {
    this.auth.loginGoogle();
  };

  loginFacebook = () => {
    this.auth.loginFacebook();
  };

  handleSubmit = async () => {
    const { client, history } = this.props;
    const { data } = await client.query({
      query: gql`
        query {
          login(username: "${this.state.account}", password: "${
        this.state.password
      }") {
            token
            apiError {
              code
              message
            }
          }
        }
      `
    });
    // successful login
    if (data.login.token) {
      console.log(data.login);
      const payload = decode(data.login.token);
      localStorage.setItem('FTM_TOKEN', data.login.token);
      client.writeData({
        data: { token: data.login.token, userId: payload.id }
      });
      history.replace('/');
    }
  };

  handleAccountChange = event => {
    this.setState({ account: event.target.value });
  };

  handlePasswordChange = event => {
    this.setState({ password: event.target.value });
  };

  render() {
    return (
      <form className="login-root">
        <div className="social-buttons">
          <Button
            variant="contained"
            color="primary"
            id="fb-btn"
            onClick={this.loginFacebook}
          >
            <img alt="fb-logo" id="fb-logo" src={fbLogo} />
            Log in With Facebook
          </Button>
          <Button
            variant="contained"
            id="google-btn"
            onClick={this.loginGoogle}
          >
            <img id="gg-logo" alt="gg-logo" src={ggLogo} />
            Log in With Google
          </Button>
        </div>
        <TextField
          onChange={this.handleAccountChange}
          label="Username or Email"
          fullWidth
          className="username"
          type="text"
        />
        <TextField
          onChange={this.handlePasswordChange}
          label="Password"
          fullWidth
          className="password"
          type="password"
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

export default withApollo(Login);
