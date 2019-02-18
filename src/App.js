import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import Home from './home/Home';
import Recipe from './recipe/Recipe';
import CreateRecipe from './createRecipe/CreateRecipe';
import Login from './login/Login';
import Profile from './profile/Profile';
import Signup from './signup/Signup';
import CallbackReceiver from './callback/CallbackReceiver';
import SignOut from './signOut/SignOut';
import RecipePDF from './profile/PDF/RecipePDF';
import withLocalData from './withLocalData';
import helpPage from './helpPage/helpPage';

class App extends Component {
  render() {
    const { token } = this.props;
    return (
      <div style={{ width: '100%', height: '100vh' }}>
        <Switch>
          <Route exact path="/" component={() => <Home token={token} />} />
          <Route exact path="/recipe" component={Recipe} />
          <Route exact path="/recipe/:id" component={Recipe} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/profile" component={Profile} />
          <Route exact path="/profile/:username" component={Profile} />
          <Route path="/signup" component={Signup} />
          <Route path="/signout" component={SignOut} />
          <Route path="/createrecipe" component={CreateRecipe} />
          <Route exact path="/exportrecipes/:recipes" component={RecipePDF} />
          <Route path="/helpPage" component={helpPage} />
          <Route
            path="/auth/google/callback"
            component={() => {
              return <CallbackReceiver token={token} source={'google'} />;
            }}
          />
          <Route
            path="/auth/facebook/callback"
            component={() => {
              return <CallbackReceiver token={token} source={'facebook'} />;
            }}
          />
        </Switch>
      </div>
    );
  }
}

export default withLocalData(App);
