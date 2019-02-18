import React, { Component } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import red from '@material-ui/core/colors/red';
import { ApolloProvider } from 'react-apollo';
import './Root.css';
import App from './App';
import AppBar from './home/AppBar/AppBar';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloLink } from 'apollo-link';
import { withClientState } from 'apollo-link-state';
import { decode } from 'jsonwebtoken';
import { createUploadLink } from 'apollo-upload-client';

const theme = createMuiTheme({
  palette: {
    primary: red
  },
  typography: {
    useNextVariants: true
  }
});
class Root extends Component {
  constructor(props) {
    super(props);
    const token = localStorage.getItem('FTM_TOKEN') || '';
    let userId = '';
    if (token) {
      userId = decode(token).id;
    }
    const cache = new InMemoryCache();
    this.client = new ApolloClient({
      link: ApolloLink.from([
        withClientState({
          cache,
          defaults: {
            token,
            userId
          }
        }),
        createUploadLink({
          uri: 'https://api.foodtomake.com/graphql'
          // uri: 'http://localhost:8081/graphql'
        })
      ]),
      cache
    });
  }

  render() {
    return (
      <div className="app-container">
        <ApolloProvider client={this.client}>
          <BrowserRouter>
            <MuiThemeProvider theme={theme}>
              <div className="app-bar">
                <AppBar />
              </div>
              <div className="content-area">
                <App />
              </div>
            </MuiThemeProvider>
          </BrowserRouter>
        </ApolloProvider>
      </div>
    );
  }
}

export default Root;
