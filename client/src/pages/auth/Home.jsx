import React from 'react';
import { useAuth } from '../../providers/AuthContext';
import { BryntumCalendar } from '@bryntum/calendar-react';
import '@bryntum/calendar/calendar.stockholm.css';



export default () => {
    const { logout } = useAuth();

    return (
        <>
          <BryntumCalendar />

          <button onClick={logout}>Logout</button>
        </>
    );
}