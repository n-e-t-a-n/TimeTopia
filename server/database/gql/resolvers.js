import client from '../mongo.js';

const resolvers = {
  Query: {
    events: async () => {
      try {
        const events = await client.db('timetopia').collection('events').find().toArray();
        return events;
      } catch (error) {
        console.error('Error fetching events:', error);
        throw new Error('Failed to fetch events');
      }
    },
  },
  Mutation: {
    createEvent: async (_, params) => {
      try {
        const result = await db.collection('events').insertOne(params);
        
        if (result["acknowledged"] === true) return params;
        
        throw new Error('Failed to create event');
      } catch (error) {
        console.error('Error creating event:', error);
        throw new Error('Failed to create event');
      }
    },
  },
};

export default resolvers;