import client from '../mongo.js';

const resolvers = {
  Query: {
    getEvents: async (_, args) => {
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
        const { email, ...eventData } = args;
        const schedule = { ...eventData }

        const currentUser = await client.db('timetopia').collection('users').findOne({ email });

        if (!currentUser) {
          return false;
        }

        const result = await client.db('timetopia').collection('users').updateOne(
          { email: email },
          { $push: { schedules: schedule } }
        );
      
        if (result.modifiedCount === 1) {
          return true;
        }

        return false;
      } catch (error) {
        console.error('Error creating event:', error);
        throw new Error('Failed to create event');
      }
    },
    updateEvent: async (_, args) => {
      try {
        const { email, id, ...updatedEventData } = args;
        const updatedEvent = { id, ...updatedEventData };
    
        const currentUser = await client.db('timetopia').collection('users').findOne({ email });
    
        if (!currentUser) {
          return false;
        }

        const eventIndex = currentUser.schedules.findIndex(event => event.id === id);

        if (eventIndex === -1) {
          return false;
        }
    
        currentUser.schedules[eventIndex] = updatedEvent;
    
        const result = await client.db('timetopia').collection('users').updateOne(
          { email: email },
          { $set: { schedules: currentUser.schedules } }
        );
    
        if (result.modifiedCount === 1) {
          return true;
        }
    
        return false;
      } catch (error) {
        console.error('Error updating event:', error);
        throw new Error('Failed to update event');
      }
    },
    deleteEvent: async (_, args) => {
      try {
        const { email, id } = args;
    
        const currentUser = await client.db('timetopia').collection('users').findOne({ email });
    
        if (!currentUser) {
          return false;
        }

        const eventIndex = currentUser.schedules.findIndex(event => event.id === id);

        if (eventIndex === -1) {
          return false;
        }

        currentUser.schedules.splice(eventIndex, 1);

        const result = await client.db('timetopia').collection('users').updateOne(
          { email: email },
          { $set: { schedules: currentUser.schedules } }
        );

        if (result.modifiedCount === 1) {
          return true;
        }

        return false;
      } catch (error) {
        console.error('Error updating event:', error);
        throw new Error('Failed to update event');
      }
    },
  },
};

export default resolvers;