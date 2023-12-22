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
          console.log("Something went wrong with the user's email")
          return false;
        }

        const result = await client.db('timetopia').collection('users').updateOne(
          { email: email },
          { $push: { schedules: schedule } }
        );
      
        if (result.modifiedCount === 1) {
          return true;
        }

        console.log('User not found or schedule not added');
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
          console.log("User not found with the provided email");
          return false;
        }
    
        // Find the index of the event to update in the schedules array
        const eventIndex = currentUser.schedules.findIndex(event => event.id === id);

        if (eventIndex === -1) {
          console.log("Event not found with the provided ID");
          return false;
        }
    
        // Update the event at the found index
        currentUser.schedules[eventIndex] = updatedEvent;

    
        const result = await client.db('timetopia').collection('users').updateOne(
          { email: email },
          { $set: { schedules: currentUser.schedules } }
        );
    
        if (result.modifiedCount === 1) {
          return true;
        }
    
        console.log('User not found or event not updated');
        return false;
      } catch (error) {
        console.error('Error updating event:', error);
        throw new Error('Failed to update event');
      }
    },
  },
};

export default resolvers;