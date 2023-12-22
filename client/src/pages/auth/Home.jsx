import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../providers/AuthContext';
import { BryntumCalendar, BryntumCalendarProjectModel } from '@bryntum/calendar-react';
import { CrudManager } from '@bryntum/calendar';
import '@bryntum/calendar/calendar.stockholm.css';

const query = `
  query getEvents($email: String!) {
    getEvents(email: $email) {
      _id
      name
      startDate
      endDate
    }
  }
`;

const variables = {
    email: 'test@test.com',
};

const Home = () => {
    const eventUpdates = {
        "add": [],
        "update": [],
        "remove": []
    }

    const { logout } = useAuth();

    const calendar = useRef();
    const project = useRef();

    const [events, setEvents] = useState([]);
    
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await fetch('http://localhost:4000/graphql', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        query,
                        variables
                    }),
                });

                const data = await response.json();
                setEvents(data["data"]["getEvents"]);
            } catch (error) {
                console.error('Error fetching events:', error);
            }
        };

        fetchEvents();
    }, []);

    const syncData = ({ store, action, records }) => {
        const unixStartDate = records[0]?._startDate.getTime();
        const unixEndDate = records[0]?._endDate.getTime();

        const startDate = new Date(unixStartDate)
        const endDate = new Date(unixEndDate)

        const update = {
            id: records[0]?.data.id,
            name: records[0]?.name,
            startDate: startDate,
            endDate: endDate
        }

        console.log(update)
    }

    const processUpdates = (updates) => {

    }

    const saveUpdates = (updates) => {
        console.log(updates)
    }
    
    return (
        <>
            <BryntumCalendarProjectModel
                ref={project}
                events={events}
            />

            <BryntumCalendar 
                ref={calendar} 
                project={project} 
                onDataChange={syncData}
            />

            <button onClick={logout}>Logout</button>
            <button onClick={() => saveUpdates(eventUpdates)}>Log Updates</button>
        </>
    );
};

export default Home;
