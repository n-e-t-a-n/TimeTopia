const typeDefs = `
  type Event {
    _id: ID!
    email: String!
    name: String!
    startDate: String!
    endDate: String!
  }

  type Query {
    events: [Event]
  }

  type Mutation {
    createEvent(email: String!, name: String!, startDate: String!, endDate: String!): Event
  }
`;

export default typeDefs;