import React, { Component } from 'react';
import { Button, TextField } from '@material-ui/core';
import './Username.css';
import { withApollo } from 'react-apollo';
import { createUserSocial as mutation } from '../graphql/mutations';
import { decode } from 'jsonwebtoken';

class Username extends Component {
  state = {
    username: '',
    error: '',
  };

  onSubmit = async (event) => {
    event.preventDefault();
    console.log(this.props);
    const { client, id, source } = this.props;
    const { data } = await client.mutate({
      mutation,
      variables: {
        id,
        type: source,
        username: this.state.username,
      },
    });
    console.log(data);
    const { error, createUserSocial } = data;
    if (error) {
      return this.setState({ error: 'Please try again' });
    }
    const { token, apiError } = createUserSocial;
    if (apiError) {
      const { code } = apiError;
      if (code) {
        if (code === 'DUPLICATE_USERNAME') {
          this.setState({ error: 'That username is in use.' });
        } else {
          return this.setState({ error: 'Please try again' });
        }
      }
    }
    const payload = decode(token);
    localStorage.setItem('FTM_TOKEN', token);
    return client.writeData({
      data: {
        token,
        userId: payload.id,
      },
    });
  };

  handleOnChange = (event) => {
    this.setState({ username: event.target.value });
  };

  render() {
    return (
      <div>
        <form className="username-root" onSubmit={this.onSubmit}>
          <TextField
            label="Username"
            fullWidth
            className="username"
            onChange={this.handleOnChange}
            error={this.state.error.length > 0}
            helperText={this.state.error}
          />
          <Button
            variant="contained"
            color="primary"
            className="submit-btn"
            type="submit"
          >
            Submit
          </Button>
        </form>
      </div>
    );
  }
}

export default withApollo(Username);
