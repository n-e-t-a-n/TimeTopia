import client from '../mongo.js';

const resolvers = {
  Query: {
    events: async (_, args) => {
      try {
        const { email } = args;

        const currentUser = await client.db('timetopia').collection('users').findOne({ email });
        
        return currentUser["schedules"];
      } catch (error) {
        console.error('Error fetching events:', error);
        throw new Error('Failed to fetch events');
      } 
    },
  },
  Mutation: {
    createEvent: async (_, args) => {
      try {
        const result = await db.collection('events').insertOne(args);
        
        if (result["acknowledged"] === true) return args;
        
        throw new Error('Failed to create event');
      } catch (error) {
        console.error('Error creating event:', error);
        throw new Error('Failed to create event');
      }
    },
  },
};

export default resolvers;