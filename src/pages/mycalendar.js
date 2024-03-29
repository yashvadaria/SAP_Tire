import React, { useState, useRef, useEffect, useCallback } from "react";
import Papa from "papaparse";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { TopNav } from "src/layouts/dashboard/top-nav";
import { Box, Container, Stack } from "@mui/system";
import { Button, SvgIcon, Tooltip, Typography } from "@mui/material";
import ArrowUpOnSquareIcon from "@heroicons/react/24/solid/ArrowUpOnSquareIcon";
import { alpha } from "@mui/material/styles";
import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
import ArrowDownOnSquareIcon from "@heroicons/react/24/solid/ArrowDownOnSquareIcon";
import axios from "axios";
import { ReactComponent as CalendarIllustration } from "public/assets/calendar-illustration.svg";
import { set, start } from "nprogress";
const SIDE_NAV_WIDTH = 280;
const TOP_NAV_HEIGHT = 64;
const BASE_URL = "http://127.0.0.1:8000";
const UPLOAD_BASE_URL = `${BASE_URL}/uploadfile/`;
const GET_URL = `${BASE_URL}/calendar`;

const MyCalendar = (props) => {
    const [events, setEvents] = useState([]);
    const [result, setResult] = useState("");
    let fileInput = useRef(null);
    // const [selectedFile, setSelectedFile] = useState(null);
    const [startDate, setStartDate] = useState(new Date("2022-10-01"));

    useEffect(() => {
        // Fetch data initially or whenever startDate and endDate change
        fetchData("2022-10-01", "2022-11-01");
    }, []);
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
            setResult(response.data.result);
            console.log("we are here ", response.data.result);
            if (!response.data.result) return;
            // Parse the data and setEvents
            const eventsData = response.data.result?.map((row) => {
                const formatedDate = (currentDate) => {
                    if (!currentDate) return;

                    const [date, time] = currentDate.split(" ");
                    const [year, monthNumber, day] = date.split("-");
                    const [hour, minute, second] = time.split(":");
                    console.log(year, monthNumber - 1, day, hour, minute);
                    return new Date(year, monthNumber - 1, day, hour, minute);
                };
                const formatedEndDate = (currentDate, type) => {
                    // console.log(currentDate)
                    if (!currentDate) return;

                    const [date, time] = currentDate.split(" ");
                    const [year, monthNumber, day] = date.split("-");
                    const [hour, minute, second] = time.split(":");
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
                    console.log(endDate);
                    return endDate;
                };
                return {
                    title: row[1], // Car type as event title
                    start: formatedDate(row[0]), // Start date and time
                    end: formatedEndDate(row[0], row[1]), // End date and time
                };
                // Your existing logic for formatting events
            });
            console.log("we are here ", eventsData);
            setEvents(eventsData);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };


    // Function to handle file change
    const handleFileChange = async (e) => {
        const file = e.target.files[0];

        if (file) {
            try {
                // Create a FormData object to append the file
                const formData = new FormData();
                formData.append("file", file);

                // Make a POST request using Axios
                const response = await axios.post(UPLOAD_BASE_URL, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
                // Use the response data if needed
                setResult(response.data.result);
                console.log("Here" + response.data);
            } catch (err) {
                console.log(err);
            }

        }
    };
    const eventStyleGetter = (event, start, end, isSelected) => {
        var style = {
            backgroundColor: "#1C2536",
            borderRadius: "0px",
            opacity: 1,
            color: "white",
            border: "1px white solid",
            display: "flex",
            fontSize: "0.8rem",
        };
        switch (event.title) {
            case "class 2 truck":
                style.backgroundColor = "#F04438";
                break;
            case "class 1 truck":
                style.backgroundColor = "#10B981";
                break;
            case "compact":
                style.backgroundColor = "#F79009";
                break;
            case "medium":
                style.backgroundColor = "#6366F1";
                break;
            case "full-size":
                style.backgroundColor = "#3E2A78";
                break;
        }
        return {
            style: style,
        };
    };
    const handleCalendarNavigate = useCallback(
        (newDate, view) => {
            console.log("New Date:", newDate);
            let formattedStartDate;
            let formattedEndDate;

            if (view === "month") {
                // If the current view is "month", use the start of the month
                formattedStartDate = moment(newDate).startOf("month").format("YYYY-MM-DD");
                formattedEndDate = moment(newDate).endOf("month").format("YYYY-MM-DD");
            } else if (view === "week") {
                // If the current view is "week", use the start and end of the week
                formattedStartDate = moment(newDate).startOf("week").format("YYYY-MM-DD");
                formattedEndDate = moment(newDate).endOf("week").format("YYYY-MM-DD");
            } else {
                // For other views (e.g., "day"), use the start and end dates directly
                formattedStartDate = moment(newDate).format("YYYY-MM-DD");
                formattedEndDate = moment(newDate).format("YYYY-MM-DD");
            }

            // Now, formattedStartDate and formattedEndDate contain the dates in "YYYY-MM-DD" format
            console.log("Formatted Start Date:", formattedStartDate);
            console.log("Formatted End Date:", formattedEndDate);

            // Update start and end dates when the calendar navigates

            // // Fetch data for the new date range
            fetchData(formattedStartDate, formattedEndDate);

            // Assuming setDate is a state-setting function
            setStartDate(formattedStartDate);
        },
        [setStartDate]
    );

    const localizer = momentLocalizer(moment);

    return (
        <div>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    py: 6,
                }}
            >
                <Container maxWidth="xl">
                    <Stack spacing={3} marginBottom={2}>
                        <Typography variant="h4">Overview</Typography>

                        <Stack direction="row" spacing={4}>
                            <Stack spacing={1}>
                                <Stack spacing={1} >

                                    {/* {result === "" && (
                                        <img height={400} alt="" src="/assets/calendar-illustration.svg" />
                                    )} */}
                                    <Button
                                        onClick={() => fileInput.click()}
                                        color="inherit"
                                        startIcon={
                                            <SvgIcon fontSize="small">
                                                <ArrowUpOnSquareIcon />
                                            </SvgIcon>
                                        }
                                    >
                                        Import CSV
                                    </Button>

                                    <input
                                        type="file"
                                        ref={(input) => (fileInput = input)}
                                        style={{ display: "none" }}
                                        onChange={(e) => handleFileChange(e)}
                                    />

                                </Stack>


                            </Stack>
                            <Stack alignItems="center" justifyContent={"space-around"} style={{ display: "flex", flexDirection: "row" }} spacing={1}>

                                <div style={{ height: "15px", width: "70px", background: "#F79009" }}></div>
                                <p style={{ paddingRight: "15px", paddingLeft: "10px" }}>Compact Car</p>
                                <div style={{ height: "15px", width: "70px", background: "#6366F1" }}></div>
                                <p style={{ paddingRight: "15px", paddingLeft: "10px" }}>Medium Car</p>
                                <div style={{ height: "15px", width: "70px", background: "#3E2A78" }}></div>
                                <p style={{ paddingRight: "15px", paddingLeft: "10px" }}>Full-size Car</p>
                                <div style={{ height: "15px", width: "70px", background: "#10B981" }}></div>
                                <p style={{ paddingRight: "15px", paddingLeft: "10px" }}>Class 1 Truck</p>
                                <div style={{ height: "15px", width: "70px", background: "#F04438" }}></div>
                                <p style={{ paddingRight: "15px", paddingLeft: "10px" }}>Class 2 Truck</p>
                            </Stack>
                        </Stack>
                    </Stack>

                    {result !== "" && (
                        <Calendar
                            eventPropGetter={eventStyleGetter}
                            localizer={localizer}
                            events={events}
                            startAccessor="start"
                            endAccessor="end"
                            date={startDate}
                            style={{ height: 800 }}
                            defaultDate={new Date("2022-10-01")}
                            onNavigate={handleCalendarNavigate}
                            views={['month', 'week', 'day']}
                            weekLayoutAlgorithm="no-overlap"
                        />
                    )}
                </Container>
            </Box>

        </div>
    );
};

export default MyCalendar;
