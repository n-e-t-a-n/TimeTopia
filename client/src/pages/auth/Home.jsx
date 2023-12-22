import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../providers/AuthContext';
import { BryntumCalendar, BryntumCalendarProjectModel } from '@bryntum/calendar-react';
import '@bryntum/calendar/calendar.stockholm.css';

const Home = () => {
    const eventUpdates = {
        "add": [],
        "update": [],
        "remove": [],
        "dataset": []
    }

    const { user, logout } = useAuth();

    const calendar = useRef();
    const project = useRef();

    const [events, setEvents] = useState([]);

    const query = `
        query getEvents($email: String!) {
            getEvents(email: $email) {
            id
            name
            startDate
            endDate
            }
        }
    `; 

    const variables = {
        email: JSON.parse(user)["email"]
    }

    
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

    const generateUpdate = ({ _, action, records }) => {
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

        eventUpdates[action].push(update);
    }

    const processUpdates = () => {
        const addArray = eventUpdates["add"];
        const updateArray = eventUpdates["update"];
        const removeArray = eventUpdates["remove"];

        const addIdsToRemove = new Set(updateArray.map(obj => obj.id));

        const filteredAddArray = addArray.filter(obj => !addIdsToRemove.has(obj.id));
        eventUpdates["add"] = filteredAddArray;
      
        const latestUpdates = Array.from(new Set(updateArray.map(obj => obj.id))).map(id => {
          const updatesWithId = updateArray.filter(obj => obj.id === id);
          const latestUpdate = updatesWithId.reduce((latest, current) => {
            return latest.timestamp > current.timestamp ? latest : current;
          });
          return latestUpdate;
        });

        eventUpdates["update"] = latestUpdates;

        const removeIds = new Set(removeArray.map(obj => obj.id));
        
        eventUpdates["add"] = eventUpdates["add"].filter(obj => !removeIds.has(obj.id));
        eventUpdates["update"] = eventUpdates["update"].filter(obj => !removeIds.has(obj.id));
      };

    const saveUpdates = (updates) => {
        processUpdates()
        console.log(eventUpdates)
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
                onDataChange={generateUpdate}
            />

            <button onClick={logout}>Logout</button>
            <button onClick={() => saveUpdates(eventUpdates)}>Log Updates</button>
        </>
    );
};

export default Home;
