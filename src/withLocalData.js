import { graphql } from 'react-apollo';
import { getToken } from './graphql/queries';

export default function withLocalData(wrappedComponent) {
  return graphql(getToken, {
    props: ({ data: { token, userId } }) => ({ token, userId })
  })(wrappedComponent);
}
