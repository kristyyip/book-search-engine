const typeDefs = `
  type User {
    _id: ID!
    username: String!
    email: String!
    bookCount: Int
    savedBooks: [Book]
  }

  type Book {
    bookId: ID!
    authors: [String]
    description: String!
    image: String
    link: String
    title: String!
  }

  type Auth {
    token: ID!
    user: User
  }

  type Query {
    getUser: User
  }

  type Mutation {
    createUser(username: String!, email: String!, password: String!): Auth

    login(email: String!, password: String!): Auth

    saveBook(authors: [String], description: String!, bookId: ID!, image: String, link: String, title: String!): User

    deleteBook(bookId: ID!): User
  }
`;

module.exports = typeDefs;