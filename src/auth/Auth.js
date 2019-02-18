import { WebAuth } from 'auth0-js';

const host =
  process.env.NODE_ENV === 'production'
    ? 'https://www.foodtomake.com'
    : 'http://localhost:3000';

export default class Auth {
  auth0 = new WebAuth({
    domain: 'foodtomake.auth0.com',
    clientID: 'Xl3JO8Pwt2fgVmtCr0K6fTo1axSPjCBs', // This is auth0 clientId not google or facebook clientId
    responseType: 'id_token',
    scope: 'openid',
  });

  loginGoogle = () => {
    this.auth0.authorize({
      connection: 'google-oauth2',
      redirectUri: `${host}/auth/google/callback`,
    });
  };

  loginFacebook = () => {
    this.auth0.authorize({
      connection: 'facebook',
      redirectUri: `${host}/auth/facebook/callback`,
    });
  };

  handleAuthCallback = async () => {
    return new Promise((resolve, reject) => {
      return this.auth0.parseHash((error, authResult) => {
        if (error) {
          reject(error);
        }
        resolve(authResult.idTokenPayload.sub); // authResult.idTokenPayload.sub is the unique identifier for the user
      });
    });
  };
}
