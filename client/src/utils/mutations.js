import { gql } from '@apollo/client';

export const LOGIN_USESR = gql`
  mutation loginUser($email: String!, $password: String!) {
    loginUser(email: $email, password: $password) {
        token
        user {
          _id
          username
        }
    }
  }
`;

export const ADD_USER = gql`
  mutation addUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
        token
        user {
            _id
            username
        }
    }
  }
`;

export const SAVE_BOOK = gql`
  mutation saveBook($bookInfo: BookInput!) {
    saveBook(bookInfo: $bookInfo) {
        _id
        username
        email
        savedBooks {
            bookId
            authors
            description
            image
            link
            title
        }
    }
  }
`;

export const REMOVE_BOOK = gql`
  mutation removeBook($bookId: ID!) {
    removeBook(bookId: $bookId) {
        _id
        username
        email
        savedBooks {
            bookId
            authors
            description
            image
            link
            title
        }
    }
  }
`