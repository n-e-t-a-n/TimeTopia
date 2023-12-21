import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../providers/AuthContext';
import { BryntumCalendar, BryntumCalendarProjectModel } from '@bryntum/calendar-react';
import '@bryntum/calendar/calendar.stockholm.css';

const query = `
  query events($email: String!) {
    events(email: $email) {
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
                setEvents(data["data"]["events"]);
            } catch (error) {
                console.error('Error fetching events:', error);
            }
        };

        fetchEvents();
    }, []);
    
    return (
        <>
            <BryntumCalendarProjectModel
                ref={project}
                events={events}
            />

            <BryntumCalendar ref={calendar} project={project} />

            <button onClick={logout}>Logout</button>
        </>
    );
};

export default Home;
