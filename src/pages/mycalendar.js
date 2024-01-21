import React, { useState, useRef, useEffect, useCallback } from 'react';
import Papa from 'papaparse';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { TopNav } from 'src/layouts/dashboard/top-nav';
import { Box, Container, Stack } from '@mui/system';
import { Button, SvgIcon, Tooltip, Typography } from '@mui/material';
import ArrowUpOnSquareIcon from '@heroicons/react/24/solid/ArrowUpOnSquareIcon';
import { alpha } from '@mui/material/styles';
import PlusIcon from '@heroicons/react/24/solid/PlusIcon';
import ArrowDownOnSquareIcon from '@heroicons/react/24/solid/ArrowDownOnSquareIcon';
import axios from 'axios';


const SIDE_NAV_WIDTH = 280;
const TOP_NAV_HEIGHT = 64;
const BASE_URL = "http://127.0.0.1:8000";
const UPLOAD_BASE_URL = `${BASE_URL}/uploadfile/`;
const GET_URL = `${BASE_URL}/calendar`;

const MyCalendar = (props) => {
    const [events, setEvents] = useState([]);
    let fileInput = useRef(null);
    // const [selectedFile, setSelectedFile] = useState(null);
    const [startDate, setStartDate] = useState(new Date('2022-09-01'));

    // useEffect(() => {
    //     // Fetch data initially or whenever startDate and endDate change
    //     fetchData(startDate, endDate);
    // }, [startDate, endDate]);
    const fetchData = async (startDate1, endDate1) => {
        let response;
        try {
            // Make a GET request with parameters
            response = await axios.get(GET_URL, {
                params: {
                    startdate: startDate1,
                    enddate: endDate1,
                },
            });

            // Use the response data if needed
            console.log(response.data);
            if (!response.data.result)
                return
            // Parse the data and setEvents
            const eventsData = response.data.result?.map((row) => {
                const formatedDate = (currentDate) => {
                    if (!currentDate)
                        return;

                    const [date, time] = currentDate.split(' ');
                    const [year, monthNumber, day] = date.split('-');
                    const [hour, minute, second] = time.split(':');
                    console.log(year, monthNumber - 1, day, hour, minute)
                    return new Date(year, monthNumber - 1, day, hour, minute);
                }
                const formatedEndDate = (currentDate, type) => {
                    // console.log(currentDate)
                    if (!currentDate)
                        return;

                    const [date, time] = currentDate.split(' ');
                    const [year, monthNumber, day] = date.split('-');
                    const [hour, minute, second] = time.split(':');
                    let endDate;
                    switch (type) {
                        case "class 2 truck":
                            // Add 2 hours for "class 2 truck" type
                            endDate = new Date(year, monthNumber - 1, day, hour, minute);
                            endDate.setHours(endDate.getHours() + 2);
                            break;
                        case "class 1 truck":
                            // Add 1 hour for "class 1 truck" type
                            endDate = new Date(year, monthNumber - 1, day, hour, minute);
                            endDate.setHours(endDate.getHours() + 1);
                            break;
                        case "compact":
                        case "medium":
                        case "full-size":
                            // Add 30 minutes for "compact", "medium", and "full-size" types
                            endDate = new Date(year, monthNumber - 1, day, hour, minute);
                            endDate.setMinutes(endDate.getMinutes() + 30);
                            break;
                        default:
                            endDate = new Date(year, monthNumber - 1, day, hour, minute);
                            break;
                    }
                    console.log(endDate)
                    return endDate;
                }
                return {
                    title: row[1], // Car type as event title
                    start: formatedDate(row[0]), // Start date and time
                    end: formatedEndDate(row[0], row[1]) // End date and time
                };
                // Your existing logic for formatting events
            });
            console.log("we are here ", eventsData)
            setEvents(eventsData);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    // useEffect(() => {
    //     // Fetch data initially or whenever startDate and endDate change
    //     fetchData('2022-10-01', '2022-10-10');
    // }, []); // Empty dependency array means it will only run on mount

    // Function to handle file change
    const handleFileChange = async (e) => {
        const file = e.target.files[0];

        if (file) {
            try {
                // Create a FormData object to append the file
                const formData = new FormData();
                formData.append('file', file);

                // Make a POST request using Axios
                const response = await axios.post(UPLOAD_BASE_URL, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                // Use the response data if needed
                console.log(response.data);
            }
            catch (err) {
                console.log(err)
            }
            // Papa.parse(file, {
            //     complete: (result) => {

            //         console.log(result)
            //         // Assuming CSV structure: startDateTime, endDateTime, carType
            //         const eventsData = result.data.map((row) => {

            //             const formatedDate = (currentDate) => {
            //                 if (!currentDate)
            //                     return;

            //                 const [date, time] = currentDate.split(' ');
            //                 const [day, monthNumber, year] = date.split('-');
            //                 const [hour, minute] = time.split(':');
            //                 return new Date(year, monthNumber - 1, day, hour, minute);
            //             }
            //             const formatedEndDate = (currentDate, type) => {
            //                 // console.log(currentDate)
            //                 if (!currentDate)
            //                     return;

            //                 const [date, time] = currentDate.split(' ');
            //                 const [day, monthNumber, year] = date.split('-');
            //                 const [hour, minute] = time.split(':');
            //                 let endDate;
            //                 switch (type) {
            //                     case "class 2 truck":
            //                         // Add 2 hours for "class 2 truck" type
            //                         endDate = new Date(year, monthNumber - 1, day, hour, minute);
            //                         endDate.setHours(endDate.getHours() + 2);
            //                         break;
            //                     case "class 1 truck":
            //                         // Add 1 hour for "class 1 truck" type
            //                         endDate = new Date(year, monthNumber - 1, day, hour, minute);
            //                         endDate.setHours(endDate.getHours() + 1);
            //                         break;
            //                     case "compact":
            //                     case "medium":
            //                     case "full-size":
            //                         // Add 30 minutes for "compact", "medium", and "full-size" types
            //                         endDate = new Date(year, monthNumber - 1, day, hour, minute);
            //                         endDate.setMinutes(endDate.getMinutes() + 30);
            //                         break;
            //                     default:
            //                         endDate = new Date(year, monthNumber - 1, day, hour, minute);
            //                         break;
            //                 }
            //                 // console.log(endDate)
            //                 return endDate;
            //             }
            //             return {
            //                 title: row[2], // Car type as event title
            //                 start: formatedDate(row[1]), // Start date and time
            //                 end: formatedEndDate(row[1], row[2]) // End date and time
            //             };
            //         });

            //         setEvents(eventsData);
            //     },
            //     header: false
            // });
        }
    };
    const eventStyleGetter = (event, start, end, isSelected) => {

        var style = {
            backgroundColor: "#1C2536",
            borderRadius: '0px',
            opacity: 1,
            color: 'white',
            border: '1px white solid',
            display: 'flex',
            fontSize: '0.8rem',
        };
        switch (event.title) {
            case 'class 2 truck':
                style.backgroundColor = '#F04438';
                break;
            case 'class 1 truck':
                style.backgroundColor = '#10B981';
                break;
            case 'compact':
                style.backgroundColor = '#F79009';
                break;
            case 'medium':
                style.backgroundColor = '#6366F1';
                break;
            case 'full-size':
                style.backgroundColor = '#3E2A78';
                break;
        }
        return {
            style: style
        };
    }
    const handleCalendarNavigate = useCallback((newDate, view) => {
        console.log('New Date:', newDate);
        let formattedStartDate;
        let formattedEndDate;

        if (view === 'month') {
            // If the current view is "month", use the start of the month
            formattedStartDate = moment(newDate).startOf('month').format('YYYY-MM-DD');
            formattedEndDate = moment(newDate).endOf('month').format('YYYY-MM-DD');
        } else if (view === 'week') {
            // If the current view is "week", use the start and end of the week
            formattedStartDate = moment(newDate).startOf('week').format('YYYY-MM-DD');
            formattedEndDate = moment(newDate).endOf('week').format('YYYY-MM-DD');
        } else {
            // For other views (e.g., "day"), use the start and end dates directly
            formattedStartDate = moment(newDate).format('YYYY-MM-DD');
            formattedEndDate = moment(newDate).format('YYYY-MM-DD');
        }

        // Now, formattedStartDate and formattedEndDate contain the dates in "YYYY-MM-DD" format
        console.log('Formatted Start Date:', formattedStartDate);
        console.log('Formatted End Date:', formattedEndDate);

        // Update start and end dates when the calendar navigates


        // // Fetch data for the new date range
        fetchData(formattedStartDate, formattedEndDate);


        // Assuming setDate is a state-setting function
        setStartDate(formattedStartDate);

    }, [setStartDate]);
    // const handleCalendarNavigate = (newDate, view, action) => {
    //     let formattedStartDate;
    //     let formattedEndDate;

    //     if (view === 'month') {
    //         // If the current view is "month", use the start of the month
    //         formattedStartDate = moment(newDate.start).startOf('month').format('YYYY-MM-DD');
    //         formattedEndDate = moment(newDate.end).endOf('month').format('YYYY-MM-DD');
    //     } else if (view === 'week') {
    //         // If the current view is "week", use the start and end of the week
    //         formattedStartDate = moment(newDate.start).startOf('week').format('YYYY-MM-DD');
    //         formattedEndDate = moment(newDate.end).endOf('week').format('YYYY-MM-DD');
    //     } else {
    //         // For other views (e.g., "day"), use the start and end dates directly
    //         formattedStartDate = moment(newDate.start).format('YYYY-MM-DD');
    //         formattedEndDate = moment(newDate.end).format('YYYY-MM-DD');
    //     }

    //     // Now, formattedStartDate and formattedEndDate contain the dates in "YYYY-MM-DD" format
    //     console.log('Formatted Start Date:', formattedStartDate);
    //     console.log('Formatted End Date:', formattedEndDate);

    //     // Update start and end dates when the calendar navigates
    //     setStartDate(formattedStartDate);
    //     setEndDate(formattedEndDate);

    //     // // Fetch data for the new date range
    //     fetchData(formattedStartDate, formattedEndDate);

    // };
    const localizer = momentLocalizer(moment);

    return (
        <div>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    py: 6
                }}
            >
                <Container maxWidth="xl">
                    <Stack spacing={3} marginBottom={2}>
                        <Stack
                            direction="row"
                            justifyContent="space-between"
                            spacing={4}
                        >
                            <Stack spacing={1}>
                                <Typography variant="h4">
                                    Overview
                                </Typography>
                                <Stack
                                    alignItems="center"
                                    direction="row"
                                    spacing={1}
                                >
                                    <Button
                                        onClick={() => fileInput.click()}
                                        color="inherit"
                                        startIcon={(
                                            <SvgIcon fontSize="small">
                                                <ArrowUpOnSquareIcon />
                                            </SvgIcon>
                                        )}
                                    >
                                        Import
                                    </Button>
                                    <input
                                        type="file"
                                        ref={(input) => (fileInput = input)}
                                        style={{ display: 'none' }}
                                        onChange={(e) => handleFileChange(e)}
                                    />

                                    {/* <Button
                                        color="inherit"
                                        startIcon={(
                                            <SvgIcon fontSize="small">
                                                <ArrowDownOnSquareIcon />
                                            </SvgIcon>
                                        )}
                                    >
                                        Export
                                    </Button> */}
                                </Stack>
                            </Stack>
                            {/* <div>
                                <Button
                                    startIcon={(
                                        <SvgIcon fontSize="small">
                                            <PlusIcon />
                                        </SvgIcon>
                                    )}
                                    variant="contained"
                                >
                                    Walk-in
                                </Button>
                            </div> */}
                        </Stack>
                    </Stack>

                    <Calendar
                        eventPropGetter={eventStyleGetter}
                        localizer={localizer}
                        events={events}
                        startAccessor="start"
                        endAccessor="end"
                        date={startDate}
                        style={{ height: 500 }}
                        defaultDate={new Date('2022-10-01')}
                        onNavigate={handleCalendarNavigate}
                    />

                </Container>
            </Box>
            {/* <Box
                component="header"
                sx={{
                    backdropFilter: 'blur(6px)',
                    backgroundColor: (theme) => alpha(theme.palette.background.default, 0.8),
                    position: 'sticky',
                    left: {
                        lg: `${SIDE_NAV_WIDTH}px`
                    },
                    top: 0,
                    width: {
                        lg: `calc(100%)`
                    },
                    zIndex: (theme) => theme.zIndex.appBar
                }}
            >
                <Stack
                    alignItems="center"
                    direction="row"
                    justifyContent="space-between"
                    spacing={2}
                    sx={{
                        minHeight: TOP_NAV_HEIGHT,
                        px: 2
                    }}
                >
                    <Stack
                        alignItems="center"
                        direction="row"
                        spacing={2}
                    >


                    </Stack>
                    <Stack
                        alignItems="center"
                        direction="row"
                        spacing={2}
                    >
                        <Tooltip title="Contacts">
                            <Button
                                onClick={() => fileInput.click()}
                                color="inherit"
                                startIcon={(
                                    <SvgIcon fontSize="small">
                                        <ArrowUpOnSquareIcon />
                                    </SvgIcon>
                                )}
                            >
                                Import
                            </Button>
                        </Tooltip>
                        <div>
                            <Button
                                startIcon={(
                                    <SvgIcon fontSize="small">
                                        <PlusIcon />
                                    </SvgIcon>
                                )}
                                variant="contained"
                            >
                                Walk-in
                            </Button>
                        </div>

                    </Stack>
                </Stack>
            </Box> */}
            {/* <input type="file" onChange={(e) => handleFileChange(e)} /> */}
        </div>
    );
};

export default MyCalendar;
