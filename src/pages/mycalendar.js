import React, { useState, useRef } from 'react';
import Papa from 'papaparse';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const MyCalendar = (props) => {
    const [events, setEvents] = useState([]);

    // Function to handle file change
    const handleFileChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            Papa.parse(file, {
                complete: (result) => {
                    // Assuming CSV structure: startDateTime, endDateTime, carType
                    const eventsData = result.data.map((row) => {
                        console.log(row)
                        return {
                            title: row[2], // Car type as event title
                            start: new Date(row[0]), // Start date and time
                            end: new Date(row[1]) // End date and time
                        };
                    });

                    setEvents(eventsData);
                },
                header: true
            });
        }
    };

    const localizer = momentLocalizer(moment);

    return (
        <div>
            <input type="file" onChange={(e) => handleFileChange(e)} />
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 500 }}
            />
        </div>
    );
};

export default MyCalendar;
