const typeDefs = `
  type Event {
    id: ID!
    name: String!
    startDate: String!
    endDate: String!
  }

  type Query {
    getEvents(email: String!): [Event]
  }

  type Mutation {
    createEvent(id: ID!
                email: String!, 
                name: String!, 
                startDate: String!, 
                endDate: String!): Boolean

    updateEvent(id: ID!, 
                email: String!
                name: String!, 
                startDate: String!, 
                endDate: String!): Boolean

    deleteEvent(id: ID!,
                email: String!): Boolean                
  }
`;

export default typeDefs;