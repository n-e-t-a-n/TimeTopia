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
    };

    let addIDs = [];
    let updateIDs = [];
    let removeIDs = [];

    const [existingEvents, setExistingEvents] = useState([]);

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

    const createEventMutation = `
        mutation CreateEvent($id: ID!, $email: String!, $name: String!, $startDate: String!, $endDate: String!) {
            createEvent(id: $id, email: $email, name: $name, startDate: $startDate, endDate: $endDate)
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

                data["data"]["getEvents"].map((obj) => {
                    setExistingEvents(existingEvents => [...existingEvents, obj["id"]])
                });
            } catch (error) {
                console.error('Error fetching events:', error);
            }
        };

        fetchEvents();
    }, []);

    const getUnique = (arr) => {
        var seen = {};
        return arr.filter(function(item) {
            return seen.hasOwnProperty(item) ? false : (seen[item] = true);
        });
    };

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

    const saveIDs = () => {
        addIDs = eventUpdates["add"].map(obj => obj["id"])
        updateIDs = eventUpdates["update"].map(obj => obj["id"])
        removeIDs = eventUpdates["remove"].map(obj => obj["id"])
    }

    const logUpdates = () => {
        processUpdates();
        saveIDs();

        console.log(addIDs, updateIDs, removeIDs)
    }

    const saveUpdates = () => {
        processUpdates();
        saveIDs();

        eventUpdates["update"].map(async (event) => {
            try {
                const uniqueExistingEvents = getUnique(existingEvents);

                if (!uniqueExistingEvents.includes(event["id"])) {
                    console.log(existingEvents)
                    console.log(event)

                    const email = JSON.parse(user)["email"]
                    const payload = { email, ...event }

                    await fetch('http://localhost:4000/graphql', {
                        method: 'POST',
                        headers: {
                        'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            query: createEventMutation,
                            variables: payload
                        }),
                    });
                }
            } catch (error) {
                console.error('Error fetching events:', error);
            }
        });

        console.log(removeIDs)
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
            <button onClick={() => logUpdates(eventUpdates)}>Log Updates</button>
            <button onClick={() => saveUpdates(eventUpdates)}>Save Updates</button>
            <button onClick={() => {console.log(getUnique(existingEvents))}}>Show Existing</button>
        </>
    );
};

export default Home;
