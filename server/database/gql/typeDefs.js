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
    createEvent(email: String!, 
                name: String!, 
                startDate: String!, 
                endDate: String!): Boolean

    updateEvent(id: ID!, 
                name: String!, 
                startDate: String!, 
                endDate: String!): Boolean

    deleteEvent(id: ID!): Boolean                
  }
`;

export default typeDefs;