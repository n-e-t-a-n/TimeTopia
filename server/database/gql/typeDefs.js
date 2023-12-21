const typeDefs = `
  type Event {
    _id: ID!
    name: String!
    startDate: String!
    endDate: String!
  }

  type Query {
    events(email: String!): [Event]
  }

  type Mutation {
    createEvent(email: String!, name: String!, startDate: String!, endDate: String!): Event
  }
`;

export default typeDefs;