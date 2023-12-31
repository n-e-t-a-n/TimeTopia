import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import "@fortawesome/fontawesome-free/css/all.min.css"

import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../providers/AuthContext';

import { BryntumCalendar, BryntumCalendarProjectModel } from '@bryntum/calendar-react';
import '@bryntum/calendar/calendar.stockholm.css';

import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css'; 

import {
  MDBNavbar,
  MDBContainer,
  MDBBtn,
  MDBIcon,
  MDBNavbarNav,
  MDBNavbarItem,
  MDBNavbarToggler,
  MDBNavbarBrand,
  MDBCollapse
} from 'mdb-react-ui-kit';

const Home = () => {
    const [openNavColorSecond, setOpenNavColorSecond] = useState(false);
    const eventUpdates = {
        "add": [],
        "update": [],
        "remove": [],
        "dataset": []
    };

    const [addIDs, setAddIDs] = useState([]);
    const [updateIDs, setUpdateIDs] = useState([])
    const [removeIDs, setRemoveIDs] = useState([])

    const [existingEvents, setExistingEvents] = useState([]);

    const { user, logout } = useAuth();

    const calendar = useRef();
    const project = useRef();

    const [events, setEvents] = useState([]);
    const [originalEvents, setOriginalEvents] = useState([]);

    const fileInputRef = React.createRef();

    const handleFileChange = (event) => {
        const file = event.target.files[0];

        if (file) {
            const reader = new FileReader();

            reader.onload = (e) => {
                try {
                    const parsedJson = JSON.parse(e.target.result);
                    
                    const data = parsedJson["data"];

                    data.map(async (event) => {
                        try {
                            const uniqueExistingEvents = getUnique(existingEvents);
            
                            if (!uniqueExistingEvents.includes(event["id"])) {
                                const email = JSON.parse(user)["email"] 
            
                                await fetch('http://localhost:4000/graphql', {
                                    method: 'POST',
                                    headers: {
                                    'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify({
                                        query: `mutation CreateEvent($id: ID!, $email: String!, $name: String!, $startDate: String!, $endDate: String!) {
                                                    createEvent(id: $id, email: $email, name: $name, startDate: $startDate, endDate: $endDate)
                                                }
                                            `,
                                        variables: { email, ...event }
                                    }),
                                });
                            }
                        } catch (error) {
                            console.error('Error fetching events:', error);
                        }
                    });
                } catch (error) {
                    console.error('Error parsing JSON:', error);
                }
            };
            reader.readAsText(file);
        }
    };

    const handleDownload = (data) => {
        const jsonData = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
    
        const a = document.createElement('a');
        a.href = url;
        a.download = 'downloadedData.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      };

    const createDialogue = (fn, action) => {
        confirmAlert({
          title: action === "Logout" ? `Are you sure you want to log out?` : `${action} all unsaved events.`,
          message: 'Please confirm.',
          buttons: [
            {
              label: 'Yes',
              onClick: () => fn()
            },
            {
              label: 'No',
              onClick: () => {}
            }
          ]
        });
      };
    
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await fetch('http://localhost:4000/graphql', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        query: `
                            query getEvents($email: String!) {
                                getEvents(email: $email) {
                                    id
                                    name
                                    startDate
                                    endDate
                                }
                            }
                        `,
                        variables: { email: JSON.parse(user)["email"] }
                    }),
                });

                const data = await response.json();
                setEvents(data["data"]["getEvents"]);

                setOriginalEvents(data["data"]["getEvents"]);

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
        setAddIDs(eventUpdates["add"].map(obj => obj["id"]))
        setUpdateIDs(eventUpdates["update"].map(obj => obj["id"]))
        setRemoveIDs(eventUpdates["remove"].map(obj => obj["id"]))
    }

    const saveUpdates = () => {
        processUpdates();
        saveIDs();

        eventUpdates["update"].map(async (event) => {
            try {
                const uniqueExistingEvents = getUnique(existingEvents);

                if (uniqueExistingEvents.includes(event["id"])) {
                    const email = JSON.parse(user)["email"]

                    await fetch('http://localhost:4000/graphql', {
                        method: 'POST',
                        headers: {
                        'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            query: `mutation UpdateEvent($id: ID!, $email: String!, $name: String!, $startDate: String!, $endDate: String!) {
                                        updateEvent(id: $id, email: $email, name: $name, startDate: $startDate, endDate: $endDate)
                                    }
                                `,
                            variables: { email, ...event }
                        }),
                    });
                } else {
                    const email = JSON.parse(user)["email"] 

                    await fetch('http://localhost:4000/graphql', {
                        method: 'POST',
                        headers: {
                        'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            query: `mutation CreateEvent($id: ID!, $email: String!, $name: String!, $startDate: String!, $endDate: String!) {
                                        createEvent(id: $id, email: $email, name: $name, startDate: $startDate, endDate: $endDate)
                                    }
                                `,
                            variables: { email, ...event }
                        }),
                    });
                }
            } catch (error) {
                console.error('Error fetching events:', error);
            }
        });

        eventUpdates["remove"].map(async (event) => {
            try {
                const uniqueExistingEvents = getUnique(existingEvents);

                if (uniqueExistingEvents.includes(event["id"])) {
                    const email = JSON.parse(user)["email"]

                    await fetch('http://localhost:4000/graphql', {
                        method: 'POST',
                        headers: {
                        'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            query: `mutation DeleteEvent($id: ID!, $email: String!) {
                                        deleteEvent(id: $id, email: $email)
                                    }
                                `,
                            variables: { email: email, id: event.id }
                        }),
                    });
                }
            } catch (error) {
                console.error('Error fetching events:', error);
            }
        });
    }
    
    return (
        <>
            <input
                type="file"
                accept=".json"
                onChange={handleFileChange}
                style={{ display: 'none' }}
                ref={fileInputRef}
            />

            <BryntumCalendarProjectModel
                ref={project}
                events={events}
            />

            <BryntumCalendar 
                ref={calendar} 
                project={project} 
                onDataChange={generateUpdate}
            />
            <MDBNavbar fixed='bottom' expand='lg' dark bgColor='dark'>
                <MDBContainer fluid>
                <MDBNavbarBrand>
                    TimeTopia
                </MDBNavbarBrand>
                    <MDBNavbarToggler
                        type='button'
                        data-target='#navbarColor02'
                        aria-controls='navbarColor02'
                        aria-expanded='false'
                        aria-label='Toggle navigation'
                        onClick={() => setOpenNavColorSecond(!openNavColorSecond)}
                    >
                        <MDBIcon icon='bars' fas />
                    </MDBNavbarToggler>
                    <MDBCollapse open={openNavColorSecond} navbar id='navbarColor02'>
                        <MDBNavbarNav className='mb-2 mb-lg-0'>
                        <MDBNavbarItem className='active'>
                                    <MDBBtn outline color="danger" className='me-2' type='button'onClick={() => createDialogue(() => {logout()}, "Logout")}>
                                        Logout
                                    </MDBBtn>
                                </MDBNavbarItem>
                        </MDBNavbarNav >
                        <MDBNavbarNav center className='mb-2 mb-lg-0'>
                                <MDBNavbarItem className='active ms-1'>
                                    <MDBBtn size="sm" type='button' onClick={() => fileInputRef.current.click()}>
                                        Import
                                    </MDBBtn>
                                </MDBNavbarItem>
                                <MDBNavbarItem className='active ms-1'>
                                    <MDBBtn size="sm" type='button' onClick={() => handleDownload({ "data": events })}>
                                        Export
                                    </MDBBtn>
                                </MDBNavbarItem>
                        </MDBNavbarNav>
                        <MDBNavbarNav right fullWidth={false} className='mb-2 mb-lg-0'>         
                            <MDBNavbarItem className='active ms-1'>
                                <MDBBtn size="sm" type='button' onClick={() => createDialogue(() => {saveUpdates(eventUpdates)}, "Save")}>
                                    Save
                                </MDBBtn>
                            </MDBNavbarItem>
                            <MDBNavbarItem className='active ms-1'>
                                <MDBBtn size="sm" type='button' onClick={() => createDialogue(() => {location.reload()}, "Cancel")}>
                                    Cancel
                                </MDBBtn>
                            </MDBNavbarItem>
                        </MDBNavbarNav>
                    </MDBCollapse>
                </MDBContainer>
            </MDBNavbar>
        </>
    );
};

export default Home;
