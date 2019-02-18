import gql from 'graphql-tag';

export const createUserSocial = gql`
  mutation createUserSocial(
    $id: String!
    $username: String!
    $type: SocialType!
  ) {
    createUserSocial(id: $id, username: $username, type: $type) {
      token
      apiError {
        code
        message
      }
    }
  }
`;
