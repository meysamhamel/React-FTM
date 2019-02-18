import gql from 'graphql-tag';

export const getToken = gql`
  query {
    token @client
    userId @client
  }
`;

export const loginSocial = gql`
  query LoginSocial($id: String!, $source: SocialType!) {
    loginSocial(id: $id, type: $source) {
      token
      apiError {
        code
      }
    }
  }
`;
