import { useEffect } from "react";
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
import { Box, List, ListItem, ListItemText, Typography } from "@mui/material";
import "./Calendar.css";

const Calendar = () => {
  const dispatch = useDispatch();
  const events = useSelector((state) => state.architect.events) || []; // ✅ Évite undefined

  useEffect(() => {
    dispatch(fetchEvents());
    console.log("Fetching events..."); // ✅ Vérification
  }, [dispatch]);

  const handleDateClick = (selected) => {
    const title = prompt("Please enter a new title for your event");
    if (!title) return;

    const newEvent = {
      id: `${selected.dateStr}-${title}`,
      title,
      start: selected.startStr,
      end: selected.endStr,
      allDay: selected.allDay,
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
                  key={event.id}
                  sx={{
                    backgroundColor: "#ff919d",
                    margin: "10px 0",
                    borderRadius: "2px",
                  }}
                >
                <ListItemText
                  primary={event.title}
                  secondary={
                    <Typography>
                      {formatDate(event.start, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </Typography>
                  }
                />
              </ListItem>
               ))
            ) : (
              <Typography>No events</Typography> // ✅ Message si pas d'événements
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
            events={events} // Utilisation des événements du Redux store
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Calendar;
