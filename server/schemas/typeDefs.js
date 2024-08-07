const typeDefs = `
  type User {
    _id: ID
    username: String!
    email: String!
    password: String!
    savedBooks: [String]!
  }

  type Auth {
    token: ID!
    user: User
  }

  type Query {
    getSingleUser(_id: ID): User
  }

  type Mutation {
    createUser(username: String!, email: String!, password: String!): Auth

    login(username: String, email: String, password: String!): Auth

    saveBook(authors: String, description: String!, bookId: String!, image: String, link: String, title: String!): User

    deleteBook(bookId: ID!): User
  }
`;

module.exports = typeDefs;