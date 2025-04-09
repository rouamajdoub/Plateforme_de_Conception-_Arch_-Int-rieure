import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  addEvent,
  deleteEvent,
  fetchEvents,
} from "../../../../../redux/slices/eventSlice";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import { formatDate } from "@fullcalendar/core";
import {
  Box,
  List,
  ListItem,
  ListItemText,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";
import "./Calendar.css";

const Calendar = () => {
  const dispatch = useDispatch();

  // Make sure to access the correct state path
  const { events, loading, error } = useSelector((state) => state.events);

  // State for event form
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    dispatch(fetchEvents());
    console.log("Fetching events...");
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      setShowError(true);
      const timer = setTimeout(() => setShowError(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Format events for FullCalendar
  const formattedEvents = Array.isArray(events)
    ? events.map((event) => ({
        id: event._id,
        title: event.title,
        start: new Date(event.date),
        end: new Date(event.date),
        extendedProps: {
          description: event.description,
          location: event.location,
        },
      }))
    : [];

  const handleDateClick = (selected) => {
    const title = prompt("Please enter a new title for your event");
    if (!title) return;

    const description = prompt("Please enter a description (optional)");
    const location = prompt("Please enter a location (optional)");

    const newEvent = {
      title,
      description: description || "Added from calendar",
      date: selected.startStr, // This matches your backend schema
      location: location || "Online",
      // createdBy is added by the backend based on the authenticated user
    };

    dispatch(addEvent(newEvent));
  };

  const handleEventClick = (selected) => {
    if (
      window.confirm(
        `Are you sure you want to delete '${selected.event.title}'?`
      )
    ) {
      dispatch(deleteEvent(selected.event.id));
    }
  };

  return (
    <Box m="20px">
      <Typography
        variant="h1"
        sx={{ color: "var(--black)", fontWeight: "bold", marginBottom: "20px" }}
      >
        Calendar
      </Typography>

      {showError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box display="flex" justifyContent="center" p={3}>
          <CircularProgress />
        </Box>
      ) : (
        <Box display="flex" justifyContent="space-between">
          {/* Sidebar */}
          <Box flex="1 1 20%" p="15px">
            <Typography
              variant="h4"
              sx={{ color: "var(--black)", fontWeight: "bold" }}
            >
              Events
            </Typography>
            <List>
              {Array.isArray(events) && events.length > 0 ? (
                events.map((event) => (
                  <ListItem
                    key={event._id}
                    sx={{
                      backgroundColor: "#ff919d",
                      margin: "10px 0",
                      borderRadius: "2px",
                    }}
                  >
                    <ListItemText
                      primary={event.title}
                      secondary={
                        <>
                          <Typography>
                            {formatDate(new Date(event.date), {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </Typography>
                          {event.location && (
                            <Typography variant="caption">
                              Location: {event.location}
                            </Typography>
                          )}
                        </>
                      }
                    />
                  </ListItem>
                ))
              ) : (
                <Typography>No events</Typography>
              )}
            </List>
          </Box>

          {/* FullCalendar */}
          <Box flex="1 1 100%" ml="15px">
            <FullCalendar
              height="75vh"
              plugins={[
                dayGridPlugin,
                timeGridPlugin,
                interactionPlugin,
                listPlugin,
              ]}
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "dayGridMonth,timeGridWeek,timeGridDay,listMonth",
              }}
              initialView="dayGridMonth"
              editable={true}
              selectable={true}
              selectMirror={true}
              dayMaxEvents={true}
              select={handleDateClick}
              eventClick={handleEventClick}
              events={formattedEvents}
              eventTimeFormat={{
                hour: "numeric",
                minute: "2-digit",
                meridiem: "short",
              }}
            />
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default Calendar;
